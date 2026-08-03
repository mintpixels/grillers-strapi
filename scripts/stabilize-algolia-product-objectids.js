#!/usr/bin/env node

const fs = require("node:fs")
const path = require("node:path")

const INDEX_NAME = "production_api::product.product"
const PAGE_SIZE = 1000
const BATCH_SIZE = 100

function loadDotenv() {
  const envPath = path.join(process.cwd(), ".env")
  if (!fs.existsSync(envPath)) return

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (!match) continue
    const [, key, rawValue] = match
    if (process.env[key] != null) continue
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "")
  }
}

function productObjectID(record) {
  const value =
    record?.medusa_product_id ||
    record?.MedusaProduct?.ProductId ||
    record?.documentId ||
    record?.id

  return value == null ? null : String(value)
}

function isStub(record) {
  return !record || (!record.Title && !record.MedusaProduct && !record.FeaturedImage)
}

function normalizableRecord(record, stableID) {
  const normalized = { ...record, objectID: stableID }

  for (const key of Object.keys(normalized)) {
    if (key.startsWith("_")) {
      delete normalized[key]
    }
  }

  return normalized
}

function newer(a, b) {
  return new Date(a?.updatedAt || a?.publishedAt || a?.createdAt || 0).getTime() >
    new Date(b?.updatedAt || b?.publishedAt || b?.createdAt || 0).getTime()
    ? a
    : b
}

async function algoliaFetch(appId, apiKey, pathname, options = {}) {
  const response = await fetch(`https://${appId}-dsn.algolia.net${pathname}`, {
    ...options,
    headers: {
      "X-Algolia-API-Key": apiKey,
      "X-Algolia-Application-Id": appId,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Algolia ${options.method || "GET"} ${pathname} failed: ${response.status} ${text}`)
  }

  return response.json()
}

async function waitTask(appId, apiKey, taskID) {
  for (let i = 0; i < 30; i++) {
    const task = await algoliaFetch(
      appId,
      apiKey,
      `/1/indexes/${encodeURIComponent(INDEX_NAME)}/task/${taskID}`
    )
    if (task.status === "published") return
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error(`Algolia task ${taskID} did not publish in time`)
}

async function browseAll(appId, apiKey) {
  const hits = []
  let page = 0
  let nbPages = 1

  while (page < nbPages) {
    const data = await algoliaFetch(
      appId,
      apiKey,
      `/1/indexes/${encodeURIComponent(INDEX_NAME)}/query`,
      {
        method: "POST",
        body: JSON.stringify({
          query: "",
          page,
          hitsPerPage: PAGE_SIZE,
        }),
      }
    )

    hits.push(...(data.hits || []))
    nbPages = data.nbPages || 0
    page += 1
  }

  return hits
}

async function run() {
  loadDotenv()

  const appId = process.env.ALGOLIA_APP_ID
  const apiKey = process.env.ALGOLIA_WRITE_KEY
  const dryRun = process.argv.includes("--dry-run")

  if (!appId || !apiKey) {
    throw new Error("ALGOLIA_APP_ID and ALGOLIA_WRITE_KEY are required")
  }

  const hits = await browseAll(appId, apiKey)
  const saveByStableID = new Map()
  const stableIDsToSave = new Set()
  const deleteIDs = new Set()
  let stubCount = 0

  for (const hit of hits) {
    const objectID = String(hit.objectID)

    if (isStub(hit)) {
      deleteIDs.add(objectID)
      stubCount += 1
      continue
    }

    const stableID = productObjectID(hit)
    if (!stableID) {
      deleteIDs.add(objectID)
      continue
    }

    const normalized = normalizableRecord(hit, stableID)
    const existing = saveByStableID.get(stableID)
    saveByStableID.set(stableID, existing ? newer(existing, normalized) : normalized)

    if (objectID !== stableID) {
      stableIDsToSave.add(stableID)
      deleteIDs.add(objectID)
    }
  }

  for (const stableID of saveByStableID.keys()) {
    deleteIDs.delete(stableID)
  }

  const saves = Array.from(saveByStableID.values()).filter((record) =>
    stableIDsToSave.has(record.objectID)
  )
  const deletes = Array.from(deleteIDs)

  console.log(
    JSON.stringify(
      {
        index: INDEX_NAME,
        dryRun,
        scanned: hits.length,
        stableRecords: saveByStableID.size,
        recordsToSave: saves.length,
        recordsToDelete: deletes.length,
        stubsToDelete: stubCount,
      },
      null,
      2
    )
  )

  if (dryRun) return

  for (let i = 0; i < saves.length; i += BATCH_SIZE) {
    const requests = saves.slice(i, i + BATCH_SIZE).map((record) => ({
      action: "addObject",
      body: record,
    }))
    const result = await algoliaFetch(
      appId,
      apiKey,
      `/1/indexes/${encodeURIComponent(INDEX_NAME)}/batch`,
      { method: "POST", body: JSON.stringify({ requests }) }
    )
    await waitTask(appId, apiKey, result.taskID)
  }

  for (let i = 0; i < deletes.length; i += BATCH_SIZE) {
    const requests = deletes.slice(i, i + BATCH_SIZE).map((objectID) => ({
      action: "deleteObject",
      body: { objectID },
    }))
    const result = await algoliaFetch(
      appId,
      apiKey,
      `/1/indexes/${encodeURIComponent(INDEX_NAME)}/batch`,
      { method: "POST", body: JSON.stringify({ requests }) }
    )
    await waitTask(appId, apiKey, result.taskID)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
