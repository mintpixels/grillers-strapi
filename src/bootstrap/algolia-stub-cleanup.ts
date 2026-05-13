/**
 * Cleanup hook for the strapi-algolia plugin's `null transformer →
 * objectID-only stub` bug (#115).
 *
 * The strapi-algolia plugin's `afterUpdateAndCreate` handler spreads the
 * transformer's return value directly without awaiting it (`{ objectID,
 * ...transformerCallback(...) }`). When the transformer is async or
 * returns null, the spread yields {} — the record gets written to
 * Algolia as `{ objectID }` instead of being deleted.
 *
 * Patches in node_modules/strapi-plugin-strapi-algolia don't propagate
 * through Strapi Cloud's npm cache (see memory/strapi-cloud-deploy-quirks),
 * so this runtime cleanup is the durable fix until upstream patches the
 * plugin.
 *
 * Strategy: subscribe to the same lifecycle events the plugin subscribes
 * to (after the plugin's own subscription runs), re-evaluate the
 * transformer for the touched entry, and DELETE the Algolia record when
 * the transformer says it should be filtered out.
 */

type StrapiArgs = { strapi: any }

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
  const indexName = "production_api::product.product"

  if (!appId || !writeKey) {
    strapi.log.warn(
      "[algolia-stub-cleanup] ALGOLIA_APP_ID / ALGOLIA_WRITE_KEY not set — cleanup disabled"
    )
    return
  }

  strapi.db.lifecycles.subscribe({
    models: ["api::product.product"],
    afterUpdate: (event: any) => cleanupIfNeeded(strapi, event, appId, writeKey, indexName),
    afterCreate: (event: any) => cleanupIfNeeded(strapi, event, appId, writeKey, indexName),
  })

  strapi.log.info("[algolia-stub-cleanup] subscribed to api::product.product lifecycle")
}

async function cleanupIfNeeded(
  strapi: any,
  event: any,
  appId: string,
  writeKey: string,
  indexName: string
): Promise<void> {
  try {
    const entryId =
      event?.result?.id ?? event?.params?.where?.id ?? null
    if (!entryId) return

    // Re-fetch the entry with the same populate the transformer reads from.
    // Without this, event.result may not include MedusaProduct.Variants —
    // and we'd false-positive every record as "filter out."
    const entry = await strapi.documents("api::product.product").findOne({
      documentId: event.result?.documentId ?? event.result?.documentId,
      populate: {
        MedusaProduct: {
          populate: { Variants: { fields: ["Sku"] } },
        },
      },
    })

    if (!entry) return
    if (!shouldFilterOut(entry)) return

    // Transformer would return null for this entry → plugin's stub will
    // exist or be about to exist. Delete it after a brief delay to let
    // the plugin's write land first.
    await new Promise((r) => setTimeout(r, 600))
    await deleteAlgoliaRecord(appId, writeKey, indexName, String(entryId))
    strapi.log.info(
      `[algolia-stub-cleanup] deleted stub ${entryId} (filtered by transformer rules)`
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    strapi.log.warn(`[algolia-stub-cleanup] cleanup failed: ${msg}`)
  }
}
