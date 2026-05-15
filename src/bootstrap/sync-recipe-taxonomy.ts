import fs from "node:fs"
import path from "node:path"

export const RECIPE_TAXONOMY_WRITEBACK_VERSION = "recipe-taxonomy-v1-2026-05-15"

const STORE_KEY = "recipe-taxonomy-writeback-version"
const DATA_PATH = path.join(
  process.cwd(),
  "data",
  "recipe-taxonomy-writeback-2026-05-15.json"
)

type RecipeTaxonomyRecord = {
  documentId: string
  title?: string
  data: Record<string, unknown>
}

type RecipeTaxonomyPayload = {
  version: string
  total: number
  records: RecipeTaxonomyRecord[]
}

export async function syncRecipeTaxonomy({
  strapi,
  targetVersion,
}: {
  strapi: any
  targetVersion: string
}): Promise<void> {
  const store = strapi.store({
    environment: "",
    type: "plugin",
    name: "grillers-bootstrap",
  })

  const current = await store.get({ key: STORE_KEY })
  if (current === targetVersion) {
    strapi.log.info(
      `[sync-recipe-taxonomy] already at version ${targetVersion}, skipping`
    )
    return
  }

  if (!fs.existsSync(DATA_PATH)) {
    strapi.log.warn(
      `[sync-recipe-taxonomy] no writeback file found at ${DATA_PATH}; skipping`
    )
    return
  }

  const payload = JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as RecipeTaxonomyPayload
  if (payload.version !== targetVersion) {
    throw new Error(
      `[sync-recipe-taxonomy] expected payload version ${targetVersion}, got ${payload.version}`
    )
  }

  const failures: Array<{ documentId: string; error: string }> = []

  for (const [index, record] of payload.records.entries()) {
    try {
      await strapi.documents("api::recipe.recipe").update({
        documentId: record.documentId,
        data: stripNullish(record.data),
        status: "published",
      })

      if ((index + 1) % 50 === 0 || index + 1 === payload.records.length) {
        strapi.log.info(
          `[sync-recipe-taxonomy] updated ${index + 1}/${payload.records.length}`
        )
      }
    } catch (error) {
      failures.push({
        documentId: record.documentId,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  if (failures.length) {
    throw new Error(
      `[sync-recipe-taxonomy] ${failures.length} recipes failed; first failure ${failures[0].documentId}: ${failures[0].error}`
    )
  }

  await store.set({ key: STORE_KEY, value: targetVersion })

  strapi.log.info(
    `[sync-recipe-taxonomy] synced ${payload.records.length} recipes to ${targetVersion}`
  )
}

function stripNullish(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripNullish)

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, nested]) => nested !== undefined && nested !== null)
        .map(([key, nested]) => [key, stripNullish(nested)])
    )
  }

  return value
}
