"use strict"

const fs = require("fs")
const path = require("path")
const { compileStrapi, createStrapi } = require("@strapi/strapi")

const COLLECTION_UID = "api::curated-collection.curated-collection"
const PRODUCT_UID = "api::product.product"
const DATA_PATH = path.join(__dirname, "..", "data", "curated-collections.json")

const isDryRun = process.env.DRY_RUN === "1" || process.argv.includes("--dry-run")

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function getHandle(product) {
  return product?.MedusaProduct?.Handle || ""
}

function productHaystack(product) {
  const tags = product?.Categorization?.ProductTags?.map((tag) => tag.Name) || []
  return normalize([
    product?.Title,
    getHandle(product),
    product?.MedusaProduct?.ProductId,
    ...tags,
  ].join(" "))
}

function includesAll(haystack, terms = []) {
  return terms.every((term) => haystack.includes(normalize(term)))
}

function includesAny(haystack, terms = []) {
  if (!terms.length) return true
  return terms.some((term) => haystack.includes(normalize(term)))
}

function isExcluded(haystack, terms = []) {
  return terms.some((term) => haystack.includes(normalize(term)))
}

function scoreProduct(product, selector) {
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

async function loadAllProducts(strapi) {
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
            populate: {
              Price: true,
            },
          },
        },
      },
    },
    limit: 1000,
  })

  return Array.isArray(products) ? products : []
}

function resolveProduct(products, selector) {
  let best = null
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

function blocksFromText(text) {
  if (!text) return undefined
  return [
    {
      type: "paragraph",
      children: [{ type: "text", text }],
    },
  ]
}

function mapItem(item, product, index) {
  const handle = getHandle(product)
  return {
    Product: product?.documentId,
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

function mapCollection(definition, products) {
  const missing = []
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

  const curationSlots = (definition.curationSlots || []).map((slot, index) => ({
    Label: slot.label,
    CategoryRule: slot.categoryRule,
    MinWeightLb: slot.minWeightLb,
    MaxWeightLb: slot.maxWeightLb,
    MinPricePerLb: slot.minPricePerLb,
    MaxPricePerLb: slot.maxPricePerLb,
    Required: slot.required !== false,
    Notes: slot.notes || "",
    SortOrder: index + 1,
  }))

  const recommendationRules = (definition.surfacePlacements || []).map(
    (surface, index) => ({
      Surface: surface,
      Trigger: surface === "pdp" ? "product_keyword" : "default",
      MatchKeywords: definition.pdpMatchKeywords || [],
      CustomerState: definition.customerStateFilter || "all",
      Priority: definition.sortOrder || 100,
      Notes: "",
    })
  )

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
      CurationSlots: curationSlots,
      RecommendationRules: recommendationRules,
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
      publishedAt: new Date().toISOString(),
    },
    missing,
  }
}

async function upsertCollection(strapi, data) {
  const existing = await strapi.documents(COLLECTION_UID).findMany({
    filters: { Slug: { $eq: data.Slug } },
    limit: 1,
  })
  const current = Array.isArray(existing) ? existing[0] : null

  if (isDryRun) {
    return current ? "would-update" : "would-create"
  }

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

async function seed(strapi) {
  const definitions = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"))
  const products = await loadAllProducts(strapi)

  console.log(
    `Seeding ${definitions.length} curated collections from ${products.length} Strapi products...`
  )

  let created = 0
  let updated = 0
  let wouldCreate = 0
  let wouldUpdate = 0
  const allMissing = []

  for (const definition of definitions) {
    const { data, missing } = mapCollection(definition, products)
    allMissing.push(...missing)
    const result = await upsertCollection(strapi, data)
    if (result === "created") created += 1
    if (result === "updated") updated += 1
    if (result === "would-create") wouldCreate += 1
    if (result === "would-update") wouldUpdate += 1
    console.log(`${result}: ${definition.slug} (${data.Items.length} items)`)
  }

  if (allMissing.length) {
    console.warn("\nMissing product matches:")
    for (const item of allMissing) {
      console.warn(JSON.stringify(item))
    }
  }

  console.log(
    `\nDone. created=${created} updated=${updated} wouldCreate=${wouldCreate} wouldUpdate=${wouldUpdate} missing=${allMissing.length}`
  )
}

async function main() {
  const appContext = await compileStrapi()
  const app = await createStrapi(appContext).load()
  app.log.level = "error"

  try {
    await seed(app)
  } finally {
    await app.destroy()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
