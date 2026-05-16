import fs from "node:fs"
import path from "node:path"

export const CURATED_COLLECTIONS_VERSION = "curated-collections-2026-05-15-v1"

const COLLECTION_UID = "api::curated-collection.curated-collection"
const PRODUCT_UID = "api::product.product"
const STORE_KEY = "curated-collections-version"
const DATA_PATH = path.join(process.cwd(), "data", "curated-collections.json")

type ProductRecord = {
  documentId?: string
  Title?: string
  FeaturedImage?: { url?: string }
  Categorization?: { ProductTags?: Array<{ Name?: string }> }
  MedusaProduct?: {
    Handle?: string
    ProductId?: string
    Variants?: unknown[]
  }
}

type CuratedCollectionItem = {
  handle?: string
  include?: string[]
  includeAny?: string[]
  exclude?: string[]
  quantity?: number
  originalQuantity?: number
  required?: boolean
  role?: string
  notes?: string
  originalProductName?: string
  substitutionStatus?: string
  substitutionValuePolicy?: string
  shippingCostRisk?: string
  requiresBusinessReview?: boolean
  substitutionNote?: string
  requiresSubstitutionAcknowledgement?: boolean
}

type CuratedCollectionDefinition = {
  name: string
  slug: string
  eyebrow?: string
  shortDescription: string
  longDescription?: string
  customerFacingRationale?: string
  substitutionPolicyCopy?: string
  collectionType?: string
  occasion?: string
  customerStateFilter?: string
  visibilityStart?: string
  visibilityEnd?: string
  items?: CuratedCollectionItem[]
  curationSlots?: Array<Record<string, any>>
  surfacePlacements?: string[]
  pdpMatchKeywords?: string[]
  targetPriceCents?: number
  targetMinWeightLb?: number
  targetMaxWeightLb?: number
  sortOrder?: number
  isFeatured?: boolean
  isActive?: boolean
  strategySignals?: unknown[]
}

export async function syncCuratedCollections({
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
      `[sync-curated-collections] already at version ${targetVersion}, skipping`
    )
    return
  }

  if (!fs.existsSync(DATA_PATH)) {
    strapi.log.warn(
      `[sync-curated-collections] no curated collection file found at ${DATA_PATH}; skipping`
    )
    return
  }

  const definitions = JSON.parse(
    fs.readFileSync(DATA_PATH, "utf8")
  ) as CuratedCollectionDefinition[]
  const products = await loadAllProducts(strapi)
  const allMissing: unknown[] = []
  let created = 0
  let updated = 0

  for (const definition of definitions) {
    const { data, missing } = mapCollection(definition, products)
    allMissing.push(...missing)

    if (missing.length) continue

    const result = await upsertCollection(strapi, data)
    if (result === "created") created += 1
    if (result === "updated") updated += 1
  }

  if (allMissing.length) {
    throw new Error(
      `[sync-curated-collections] ${allMissing.length} product selector(s) did not resolve; first missing ${JSON.stringify(
        allMissing[0]
      )}`
    )
  }

  await store.set({ key: STORE_KEY, value: targetVersion })

  strapi.log.info(
    `[sync-curated-collections] synced ${definitions.length} collections to ${targetVersion}; created=${created} updated=${updated}`
  )
}

async function loadAllProducts(strapi: any) {
  const products = await strapi.documents(PRODUCT_UID).findMany({
    fields: ["documentId", "Title"],
    populate: {
      FeaturedImage: { fields: ["url"] },
      Categorization: {
        populate: {
          ProductTags: { fields: ["Name"] },
        },
      },
      MedusaProduct: {
        populate: {
          Variants: {
            populate: "*",
          },
        },
      },
    },
    limit: 1000,
  })

  return Array.isArray(products) ? products : []
}

function mapCollection(
  definition: CuratedCollectionDefinition,
  products: ProductRecord[]
) {
  const missing: unknown[] = []
  const items = []

  for (const [index, item] of (definition.items || []).entries()) {
    const product = resolveProduct(products, item)
    if (!product) {
      missing.push({
        collection: definition.slug,
        role: item.role,
        include: item.include,
        includeAny: item.includeAny,
        exclude: item.exclude,
      })
      continue
    }
    items.push(mapItem(item, product, index))
  }

  return {
    data: {
      Name: definition.name,
      Slug: definition.slug,
      Eyebrow: definition.eyebrow,
      ShortDescription: definition.shortDescription,
      LongDescription: blocksFromText(definition.longDescription),
      CustomerFacingRationale: definition.customerFacingRationale,
      SubstitutionPolicyCopy: definition.substitutionPolicyCopy,
      CollectionType: definition.collectionType || "sku_backed",
      Occasion: definition.occasion || "other",
      CustomerStateFilter: definition.customerStateFilter || "all",
      VisibilityStart: definition.visibilityStart,
      VisibilityEnd: definition.visibilityEnd,
      Items: items,
      CurationSlots: (definition.curationSlots || []).map((slot, index) => ({
        Label: slot.label,
        CategoryRule: slot.categoryRule,
        MinWeightLb: slot.minWeightLb,
        MaxWeightLb: slot.maxWeightLb,
        MinPricePerLb: slot.minPricePerLb,
        MaxPricePerLb: slot.maxPricePerLb,
        Required: slot.required !== false,
        Notes: slot.notes || "",
        SortOrder: index + 1,
      })),
      RecommendationRules: (definition.surfacePlacements || []).map(
        (surface) => ({
          Surface: surface,
          Trigger: surface === "pdp" ? "product_keyword" : "default",
          MatchKeywords: definition.pdpMatchKeywords || [],
          CustomerState: definition.customerStateFilter || "all",
          Priority: definition.sortOrder || 100,
          Notes: "",
        })
      ),
      TargetPriceCents: definition.targetPriceCents,
      TargetMinWeightLb: definition.targetMinWeightLb,
      TargetMaxWeightLb: definition.targetMaxWeightLb,
      SortOrder: definition.sortOrder || 100,
      IsFeatured: Boolean(definition.isFeatured),
      IsActive: definition.isActive !== false,
      SurfacePlacements: definition.surfacePlacements || [],
      PdpMatchKeywords: definition.pdpMatchKeywords || [],
      StrategySignals: definition.strategySignals || [],
      SEO: {
        metaTitle: `${definition.name} | Griller's Pride`,
        metaDescription: definition.shortDescription,
      },
    },
    missing,
  }
}

async function upsertCollection(strapi: any, data: Record<string, unknown>) {
  const existing = await strapi.documents(COLLECTION_UID).findMany({
    filters: { Slug: { $eq: data.Slug } },
    limit: 1,
  })
  const current = Array.isArray(existing) ? existing[0] : null

  if (current?.documentId) {
    await strapi.documents(COLLECTION_UID).update({
      documentId: current.documentId,
      data,
      status: "published",
    })
    return "updated"
  }

  await strapi.documents(COLLECTION_UID).create({
    data,
    status: "published",
  })
  return "created"
}

function resolveProduct(
  products: ProductRecord[],
  selector: CuratedCollectionItem
) {
  let best: ProductRecord | null = null
  let bestScore = -1

  for (const product of products) {
    const score = scoreProduct(product, selector)
    if (score > bestScore) {
      best = product
      bestScore = score
    }
  }

  return bestScore >= 0 ? best : null
}

function scoreProduct(product: ProductRecord, selector: CuratedCollectionItem) {
  const haystack = productHaystack(product)
  if (selector.handle && getHandle(product) === selector.handle) return 1000
  if (!includesAll(haystack, selector.include || [])) return -1
  if (!includesAny(haystack, selector.includeAny || [])) return -1
  if (isExcluded(haystack, selector.exclude || [])) return -1

  let score = 0
  score += (selector.include || []).length * 20
  score += (selector.includeAny || []).some((term) =>
    haystack.includes(normalize(term))
  )
    ? 20
    : 0
  if (product.FeaturedImage?.url) score += 5
  if (haystack.includes("institutional")) score -= 20
  if (haystack.includes("case of")) score -= 15
  if (haystack.includes("bulk")) score -= 6
  return score
}

function mapItem(
  item: CuratedCollectionItem,
  product: ProductRecord,
  index: number
) {
  const handle = getHandle(product)
  return {
    Product: product.documentId,
    ProductHandle: handle || item.handle || "",
    Quantity: item.quantity || 1,
    OriginalQuantity: item.originalQuantity || 1,
    OriginalProductName: item.originalProductName || "",
    SubstitutionStatus: item.substitutionStatus || "none",
    SubstitutionValuePolicy:
      item.substitutionValuePolicy || "actual_replacement_price",
    ShippingCostRisk: item.shippingCostRisk || "normal",
    RequiresBusinessReview: Boolean(item.requiresBusinessReview),
    SubstitutionNote: item.substitutionNote || "",
    RequiresSubstitutionAcknowledgement: Boolean(
      item.requiresSubstitutionAcknowledgement
    ),
    Required: item.required !== false,
    Role: item.role || "",
    Notes: item.notes || "",
    SortOrder: index + 1,
  }
}

function getHandle(product: ProductRecord) {
  return product?.MedusaProduct?.Handle || ""
}

function productHaystack(product: ProductRecord) {
  const tags = product?.Categorization?.ProductTags?.map((tag) => tag.Name) || []
  return normalize(
    [
      product?.Title,
      getHandle(product),
      product?.MedusaProduct?.ProductId,
      ...tags,
    ].join(" ")
  )
}

function includesAll(haystack: string, terms: string[] = []) {
  return terms.every((term) => haystack.includes(normalize(term)))
}

function includesAny(haystack: string, terms: string[] = []) {
  if (!terms.length) return true
  return terms.some((term) => haystack.includes(normalize(term)))
}

function isExcluded(haystack: string, terms: string[] = []) {
  return terms.some((term) => haystack.includes(normalize(term)))
}

function normalize(value: unknown) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function blocksFromText(text?: string) {
  if (!text) return undefined
  return [
    {
      type: "paragraph",
      children: [{ type: "text", text }],
    },
  ]
}
