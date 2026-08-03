/**
 * Cleanup hook for product records that the strapi-algolia plugin cannot
 * clean up on its own.
 *
 * The strapi-algolia plugin writes and deletes records by the Strapi
 * entry ID. Product search needs a stable product objectID instead, so
 * the transformer overrides objectID with the Medusa product ID. This
 * hook removes the legacy numeric objectIDs the plugin no longer owns,
 * and removes the stable objectID when a product becomes unindexable.
 *
 * Strategy: subscribe to the same lifecycle events the plugin subscribes
 * to (after the plugin's own subscription runs), re-evaluate whether the
 * touched entry should remain indexed, and delete stale Algolia object IDs:
 *
 * - filtered, unpublished, or deleted records: delete both the plugin's
 *   numeric objectID and the stable product objectID
 * - visible records: keep the stable product objectID and delete the
 *   plugin's legacy numeric objectID
 */

type StrapiArgs = { strapi: any }

const PRODUCT_UID = "api::product.product"
const PRODUCT_INDEX_NAME = "production_api::product.product"
const PRODUCT_POPULATE = {
  MedusaProduct: {
    populate: { Variants: { fields: ["Sku"] } },
  },
}

// Mirror of config/plugins.ts transformerCallback. Kept in sync manually
// — when the transformer logic there changes, update here too.
function shouldFilterOut(record: any): boolean {
  const status = record?.MedusaProduct?.Status
  // Drop anything explicitly draft / proposed / rejected; allow null +
  // published through.
  if (status != null && status !== "published") return true
  const skus: string[] = (record?.MedusaProduct?.Variants ?? [])
    .map((v: any) => v?.Sku ?? "")
    .filter(Boolean)
  if (skus.some((s) => s.startsWith("RM-") || s.startsWith("Z-"))) return true
  return false
}

function productObjectID(record: any): string | null {
  const value =
    record?.medusa_product_id ||
    record?.MedusaProduct?.ProductId ||
    record?.documentId ||
    record?.id

  return value == null ? null : String(value)
}

function collectObjectIDs(record: any, fallbackEntryId?: unknown): string[] {
  return Array.from(
    new Set(
      [fallbackEntryId, record?.id, productObjectID(record)]
        .filter((value) => value != null)
        .map((value) => String(value))
    )
  )
}

function deleteEventKey(event: any): string {
  return JSON.stringify(event?.params?.where ?? {})
}

async function deleteAlgoliaRecord(
  appId: string,
  writeKey: string,
  indexName: string,
  objectID: string
): Promise<void> {
  const url = `https://${appId}-dsn.algolia.net/1/indexes/${encodeURIComponent(
    indexName
  )}/${encodeURIComponent(objectID)}`
  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "X-Algolia-API-Key": writeKey,
      "X-Algolia-Application-Id": appId,
      "Content-Type": "application/json",
    },
  })
  if (!res.ok && res.status !== 404) {
    throw new Error(`Algolia delete failed: ${res.status}`)
  }
}

export function registerAlgoliaStubCleanup({ strapi }: StrapiArgs) {
  const appId = process.env.ALGOLIA_APP_ID
  const writeKey = process.env.ALGOLIA_WRITE_KEY
  const pendingDeleteObjectIDs = new Map<string, string[]>()

  if (!appId || !writeKey) {
    strapi.log.warn(
      "[algolia-stub-cleanup] ALGOLIA_APP_ID / ALGOLIA_WRITE_KEY not set — cleanup disabled"
    )
    return
  }

  strapi.db.lifecycles.subscribe({
    models: [PRODUCT_UID],
    beforeDelete: (event: any) => rememberDeleteObjectIDs(strapi, event, pendingDeleteObjectIDs),
    beforeDeleteMany: (event: any) => rememberDeleteObjectIDs(strapi, event, pendingDeleteObjectIDs),
    afterDelete: (event: any) =>
      cleanupDeletedRecord(strapi, event, pendingDeleteObjectIDs, appId, writeKey),
    afterDeleteMany: (event: any) =>
      cleanupDeletedRecord(strapi, event, pendingDeleteObjectIDs, appId, writeKey),
    afterUpdate: (event: any) => cleanupIfNeeded(strapi, event, appId, writeKey),
    afterCreate: (event: any) => cleanupIfNeeded(strapi, event, appId, writeKey),
  })

  strapi.log.info(`[algolia-stub-cleanup] subscribed to ${PRODUCT_UID} lifecycle`)
}

async function fetchPublishedEntry(strapi: any, documentId: string | undefined): Promise<any | null> {
  if (!documentId) return null
  try {
    return await strapi.documents(PRODUCT_UID).findOne({
      documentId,
      status: "published",
      populate: PRODUCT_POPULATE,
    })
  } catch {
    return null
  }
}

async function fetchAnyEntry(strapi: any, event: any): Promise<any | null> {
  const documentId = event?.result?.documentId
  if (documentId) {
    try {
      return await strapi.documents(PRODUCT_UID).findOne({
        documentId,
        populate: PRODUCT_POPULATE,
      })
    } catch {
      return null
    }
  }

  const entryId = event?.result?.id ?? event?.params?.where?.id
  if (!entryId) return null

  return strapi.db.query(PRODUCT_UID).findOne({
    where: { id: entryId },
  })
}

async function rememberDeleteObjectIDs(
  strapi: any,
  event: any,
  pendingDeleteObjectIDs: Map<string, string[]>
): Promise<void> {
  try {
    const objectIDs = new Set<string>()
    for (const objectID of collectObjectIDs(event?.result, event?.params?.where?.id)) {
      objectIDs.add(objectID)
    }

    if (event?.params?.where) {
      const entries = await strapi.db.query(PRODUCT_UID).findMany({
        where: event.params.where,
      })
      for (const entry of entries ?? []) {
        for (const objectID of collectObjectIDs(entry)) {
          objectIDs.add(objectID)
        }
      }
    }

    if (objectIDs.size > 0) {
      pendingDeleteObjectIDs.set(deleteEventKey(event), Array.from(objectIDs))
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    strapi.log.warn(`[algolia-stub-cleanup] failed to remember delete IDs: ${msg}`)
  }
}

async function cleanupDeletedRecord(
  strapi: any,
  event: any,
  pendingDeleteObjectIDs: Map<string, string[]>,
  appId: string,
  writeKey: string
): Promise<void> {
  try {
    const key = deleteEventKey(event)
    const objectIDs = new Set(pendingDeleteObjectIDs.get(key) ?? [])
    pendingDeleteObjectIDs.delete(key)

    for (const objectID of collectObjectIDs(event?.result, event?.params?.where?.id)) {
      objectIDs.add(objectID)
    }

    if (objectIDs.size === 0) return

    await new Promise((r) => setTimeout(r, 600))
    await Promise.all(
      Array.from(objectIDs).map((objectID) =>
        deleteAlgoliaRecord(appId, writeKey, PRODUCT_INDEX_NAME, objectID)
      )
    )
    strapi.log.info(
      `[algolia-stub-cleanup] deleted Algolia objectIDs after product delete: ${Array.from(
        objectIDs
      ).join(", ")}`
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    strapi.log.warn(`[algolia-stub-cleanup] delete cleanup failed: ${msg}`)
  }
}

async function cleanupIfNeeded(
  strapi: any,
  event: any,
  appId: string,
  writeKey: string
): Promise<void> {
  try {
    const entryId =
      event?.result?.id ?? event?.params?.where?.id ?? null
    if (!entryId) return

    const documentId = event?.result?.documentId
    const publishedEntry = await fetchPublishedEntry(strapi, documentId)
    const identityEntry = publishedEntry ?? event?.result ?? (await fetchAnyEntry(strapi, event))
    if (!identityEntry) return

    const objectIDs = collectObjectIDs(identityEntry, entryId)
    const legacyObjectID = String(entryId)
    const stableObjectID = productObjectID(identityEntry)

    // Let the plugin's write/delete land first, then clean up object IDs
    // the plugin cannot know about because the transformer overrides them.
    await new Promise((r) => setTimeout(r, 600))

    if (!publishedEntry || shouldFilterOut(publishedEntry)) {
      await Promise.all(
        objectIDs.map((objectID) =>
          deleteAlgoliaRecord(appId, writeKey, PRODUCT_INDEX_NAME, objectID)
        )
      )
      strapi.log.info(
        `[algolia-stub-cleanup] deleted product ${entryId} (unpublished or filtered by transformer rules)`
      )
      return
    }

    if (stableObjectID && stableObjectID !== legacyObjectID) {
      await deleteAlgoliaRecord(appId, writeKey, PRODUCT_INDEX_NAME, legacyObjectID)
      strapi.log.info(
        `[algolia-stub-cleanup] deleted legacy product objectID ${legacyObjectID}; stable objectID is ${stableObjectID}`
      )
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    strapi.log.warn(`[algolia-stub-cleanup] cleanup failed: ${msg}`)
  }
}
