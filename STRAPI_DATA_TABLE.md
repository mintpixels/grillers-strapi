# Strapi CMS Data Table

**Generated:** December 1, 2024
**Strapi Version:** 5.23.1

---

## Table of Contents

1. [Collection Types](#collection-types)
2. [Single Types](#single-types)
3. [Components](#components)
4. [Relationships Diagram](#relationships-diagram)

---

## Collection Types

### Product

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| medusa_product_id | string | Yes | Yes | External ID for Medusa sync |
| Title | string | No | No | Product display name |
| FeaturedImage | media | No | No | Single image |
| GalleryImages | media (multiple) | No | No | Multiple images |
| Metadata | component | No | No | `pdp.product-metadata` |
| Recipes | relation | No | No | oneToMany → Recipe |
| Categorization | component | No | No | `pdp.sategorization` |
| MedusaProduct | component | No | No | `pdp.medusa-product` |

**Options:** Draft & Publish enabled, CSV Import/Export enabled

---

### Category

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| Name | string | Yes | No | Category name |
| Slug | uid | Yes | No | Auto-generated from Name |
| SubCategories | relation | No | No | oneToMany → SubCategory |
| MasterCategory | relation | No | No | manyToOne → MasterCategory |

---

### SubCategory

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| Name | string | Yes | No | Subcategory name |
| Slug | uid | Yes | No | Auto-generated from Name |
| Category | relation | No | No | manyToOne → Category |

---

### MasterCategory

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| Name | string | Yes | No | Master category name |
| Slug | uid | Yes | No | Auto-generated from Name |
| Categories | relation | No | No | oneToMany → Category |
| ProductType | relation | No | No | manyToOne → ProductType |

---

### ProductType

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| Name | string | Yes | No | Product type name |
| Slug | uid | Yes | No | Auto-generated from Name |
| MasterCategories | relation | No | No | oneToMany → MasterCategory |
| Aisle | relation | No | No | manyToOne → Aisle |

---

### Aisle

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| Name | string | Yes | No | Aisle name (top-level) |
| Slug | uid | Yes | No | Auto-generated from Name |
| ProductTypes | relation | No | No | oneToMany → ProductType |

---

### ProductTag

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| Name | string | Yes | No | Tag name |

---

### ProductCollection

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| Name | string | Yes | No | Collection name |
| Slug | uid | Yes | No | Auto-generated from Name |

---

### Recipe

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| Title | string | Yes | No | Recipe title |
| Slug | uid | Yes | No | Auto-generated from Title |
| ShortDescription | text | No | No | Brief description |
| Image | media | No | No | Single image (images only) |
| PublishedDate | date | No | No | Publication date |
| Servings | string | No | No | Number of servings |
| PrepTime | string | No | No | Preparation time |
| CookTime | string | No | No | Cooking time |
| TotalTime | string | No | No | Total time |
| Ingredients | component (repeatable) | No | No | `recipe.ingredient` |
| Steps | component (repeatable) | No | No | `recipe.step` |

---

### ShippingZone

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| City | string | No | No | City name |
| State | enumeration | No | No | US state codes (AK-WY) |
| ZIPCode | string | No | No | ZIP code |
| ZoneCode | string | No | No | Shipping zone identifier |
| Description | text | No | No | Zone description |
| ShippingZoneBreakpoints | component (repeatable) | No | No | `shared.shipping-zone-breakpoints` |

**State Enum Values:** AK, AL, AR, AZ, CA, CO, CT, DE, FL, GA, HI, IA, ID, IL, IN, KS, KY, LA, MA, MD, ME, MI, MN, MO, MS, MT, NC, ND, NE, NH, NJ, NM, NV, NY, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VA, VT, WA, WI, WV, WY

---

## Single Types

### Global

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| siteName | string | Yes | No | Website name |
| favicon | media | No | No | Site favicon |
| siteDescription | text | Yes | No | Site description |
| defaultSeo | component | No | No | `shared.seo` |

**Options:** Draft & Publish DISABLED (always published)

---

### Home

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| Sections | dynamiczone | No | No | Page builder sections |

**Available Dynamic Zone Components:**
- `home.hero`
- `home.bestsellers`
- `home.kosher-promise`
- `home.shop-collections`
- `home.testimonial`
- `home.follow-us`
- `home.blog-explore`

---

### Header

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| HeaderNav | component (repeatable) | No | No | `common.header-nav` |

---

### Checkout

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| ShippingBlackoutDaysOfWeek | multi-select | No | No | Custom plugin field |
| ShippingBlackoutDates | component (repeatable) | No | No | `checkout.shipping-blackout-dates` |
| DeliveryLeadTime | integer | No | No | Lead time in days |
| UPSSameDayCutoffTime | string | No | No | Cutoff time (e.g., "14:00") |
| LocalPickupSameDayText | string | No | No | Display text |

**Multi-Select Options:** Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday

---

### ShippingSetting

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| PlantPickupDiscountThreshold | decimal | No | No | Minimum order for discount |
| PlantPickUpDiscount | decimal | No | No | Discount percentage/amount |

---

### PDP (Product Detail Page)

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| HowItWorks | component | No | No | `pdp.how-it-works` |
| WhyUs | component | No | No | `pdp.why-us` |

---

## Components

### PDP Components

#### pdp.product-metadata

| Field | Type | Notes |
|-------|------|-------|
| GlutenFree | boolean | Dietary flag |
| Uncooked | boolean | State flag |
| Cooked | boolean | State flag |
| AvgPackSize | string | Average package size |
| AvgPackWeight | string | Average package weight |
| Serves | string | Serving size |
| PiecesPerPack | integer | Piece count |

---

#### pdp.sategorization (Categorization)

| Field | Type | Relation |
|-------|------|----------|
| Aisle | relation | oneToOne → Aisle |
| ProductType | relation | oneToOne → ProductType |
| MasterCategory | relation | oneToOne → MasterCategory |
| Category | relation | oneToOne → Category |
| SubCategory | relation | oneToOne → SubCategory |
| ProductTags | relation | oneToMany → ProductTag |
| ProductCollections | relation | oneToMany → ProductCollection |

---

#### pdp.medusa-product

| Field | Type | Required | Unique | Notes |
|-------|------|----------|--------|-------|
| ProductId | string | Yes | Yes | Medusa product ID |
| Title | string | No | No | Product title |
| Description | text | No | No | Product description |
| Variants | component (repeatable) | No | No | `pdp.medusa-variants` |
| Handle | string | No | No | URL handle |

---

#### pdp.medusa-variants

| Field | Type | Notes |
|-------|------|-------|
| VariantId | string | Medusa variant ID |
| Title | string | Variant title |
| Price | component | `pdp.medusa-price` |
| Sku | string | Stock keeping unit |

---

#### pdp.medusa-price

| Field | Type | Notes |
|-------|------|-------|
| CalculatedPriceNumber | decimal | Final/sale price |
| OriginalPriceNumber | decimal | Original price |

---

#### pdp.how-it-works

| Field | Type | Notes |
|-------|------|-------|
| Title | string | Section title |
| Description | text | Section description |
| Cards | component (repeatable) | `common.how-it-works-card` |

---

#### pdp.why-us

| Field | Type | Notes |
|-------|------|-------|
| Title | string | Section title |
| Image | media | Section image |
| List | component (repeatable) | `common.why-us-list` |

---

### Shared Components

#### shared.seo

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| metaTitle | string | Yes | Page title |
| metaDescription | text | Yes | Meta description |
| shareImage | media | No | OG/social image |

---

#### shared.shipping-zone-breakpoints

| Field | Type | Notes |
|-------|------|-------|
| BreakpointPrice | decimal | Price threshold |
| ShippingRate | decimal | Rate at/above threshold |

---

### Common Components

#### common.link

| Field | Type | Notes |
|-------|------|-------|
| Text | string | Link text |
| Url | string | Link URL |

---

#### common.header-nav

| Field | Type | Notes |
|-------|------|-------|
| Link | component | `common.link` (single) |
| Children | component (repeatable) | `common.link` (dropdown items) |

---

#### common.product-card

| Field | Type | Notes |
|-------|------|-------|
| Title | string | Product title |
| Slug | string | Product slug |
| Price | string | Display price |
| Description | text | Short description |
| Image | media | Product image |

---

#### common.collection-card

| Field | Type | Notes |
|-------|------|-------|
| Title | string | Collection title |
| Slug | string | Collection slug |
| Image | media | Collection image |

---

#### common.how-it-works-card

| Field | Type | Notes |
|-------|------|-------|
| Image | media | Card image |
| Text | string | Card text |

---

#### common.why-us-list

| Field | Type | Notes |
|-------|------|-------|
| Title | string | List item title |
| Description | text | List item description |

---

### Home Components

#### home.hero

| Field | Type | Notes |
|-------|------|-------|
| Title | string | Hero title |
| BackgroundImage | media | Hero background |

---

#### home.bestsellers

| Field | Type | Notes |
|-------|------|-------|
| Title | string | Section title |
| Products | component (repeatable) | `common.product-card` |

---

#### home.shop-collections

| Field | Type | Notes |
|-------|------|-------|
| Title | string | Section title |
| Collections | component (repeatable) | `common.collection-card` |

---

#### home.kosher-promise

| Field | Type | Notes |
|-------|------|-------|
| TopLogo | media | Logo image |
| Title | string | Section title |
| Content | blocks | Rich text content |
| BadgeImage | media | Badge/seal image |
| FeatureText | string | Feature headline |
| FeatureImage | media | Feature image |
| Link | component | `common.link` |

---

#### home.testimonial

| Field | Type | Notes |
|-------|------|-------|
| BackgroundImage | media | Section background |
| Quote | blocks | Testimonial text |
| Author | string | Author name |

---

#### home.follow-us

| Field | Type | Notes |
|-------|------|-------|
| Title | string | Section title |
| Description | text | Section description |
| SmallImages | media (multiple) | Social grid images |
| BigImage | media | Featured image |

---

#### home.blog-explore

| Field | Type | Notes |
|-------|------|-------|
| CategoryLabel | string | Category label |
| Title | string | Section title |
| Button | component | `common.link` |
| QuoteDecorImage | media | Decorative image |
| MainImage | media | Main feature image |

---

### Recipe Components

#### recipe.ingredient

| Field | Type | Notes |
|-------|------|-------|
| ingredient | text | Ingredient text |

---

#### recipe.step

| Field | Type | Notes |
|-------|------|-------|
| instruction | text | Step instruction |

---

### Checkout Components

#### checkout.shipping-blackout-dates

| Field | Type | Notes |
|-------|------|-------|
| Date | date | Blackout date |

---

## Relationships Diagram

```
                                    ┌─────────────┐
                                    │   AISLE     │ (Top Level)
                                    │  - Name     │
                                    │  - Slug     │
                                    └──────┬──────┘
                                           │ oneToMany
                                           ▼
                                    ┌─────────────────┐
                                    │  PRODUCT TYPE   │
                                    │  - Name         │
                                    │  - Slug         │
                                    └────────┬────────┘
                                             │ oneToMany
                                             ▼
                                    ┌─────────────────────┐
                                    │  MASTER CATEGORY    │
                                    │  - Name             │
                                    │  - Slug             │
                                    └──────────┬──────────┘
                                               │ oneToMany
                                               ▼
                                    ┌─────────────────┐
                                    │   CATEGORY      │
                                    │  - Name         │
                                    │  - Slug         │
                                    └────────┬────────┘
                                             │ oneToMany
                                             ▼
                                    ┌─────────────────┐
                                    │  SUB CATEGORY   │
                                    │  - Name         │
                                    │  - Slug         │
                                    └─────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                           PRODUCT                                  │
├───────────────────────────────────────────────────────────────────┤
│  medusa_product_id (unique)                                       │
│  Title                                                            │
│  FeaturedImage                                                    │
│  GalleryImages                                                    │
│                                                                   │
│  ┌─ Metadata (ProductMetadata) ───────────────────────────┐      │
│  │  GlutenFree, Uncooked, Cooked, AvgPackSize,            │      │
│  │  AvgPackWeight, Serves, PiecesPerPack                  │      │
│  └────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ Categorization ───────────────────────────────────────┐      │
│  │  → Aisle (1:1)                                         │      │
│  │  → ProductType (1:1)                                   │      │
│  │  → MasterCategory (1:1)                                │      │
│  │  → Category (1:1)                                      │      │
│  │  → SubCategory (1:1)                                   │      │
│  │  → ProductTags (1:many)                                │      │
│  │  → ProductCollections (1:many)                         │      │
│  └────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌─ MedusaProduct ────────────────────────────────────────┐      │
│  │  ProductId (unique), Title, Description, Handle        │      │
│  │  ┌─ Variants[] ─────────────────────────────────┐     │      │
│  │  │  VariantId, Title, Sku                       │     │      │
│  │  │  ┌─ Price ────────────────────────────┐     │     │      │
│  │  │  │  CalculatedPriceNumber             │     │     │      │
│  │  │  │  OriginalPriceNumber               │     │     │      │
│  │  │  └────────────────────────────────────┘     │     │      │
│  │  └──────────────────────────────────────────────┘     │      │
│  └────────────────────────────────────────────────────────┘      │
│                                                                   │
│  → Recipes (1:many)                                               │
└───────────────────────────────────────────────────────────────────┘
                              │
                              │ oneToMany
                              ▼
┌─────────────────────────────────────────────────────────┐
│                        RECIPE                            │
├─────────────────────────────────────────────────────────┤
│  Title, Slug, ShortDescription, Image                   │
│  PublishedDate, Servings, PrepTime, CookTime, TotalTime │
│  Ingredients[] (recipe.ingredient)                      │
│  Steps[] (recipe.step)                                  │
└─────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────┐
│                    SHIPPING ZONE                         │
├─────────────────────────────────────────────────────────┤
│  City, State (enum), ZIPCode, ZoneCode, Description     │
│  ┌─ ShippingZoneBreakpoints[] ───────────────────┐     │
│  │  BreakpointPrice, ShippingRate                 │     │
│  └────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Collection Types | 10 |
| Single Types | 5 |
| Components | 29 |
| Total Content Types | 15 |
| Total Fields (approx) | 120+ |

### Content Types by Category

| Purpose | Content Types |
|---------|---------------|
| Product Catalog | Product, Aisle, ProductType, MasterCategory, Category, SubCategory, ProductTag, ProductCollection |
| Content | Recipe |
| Shipping | ShippingZone, ShippingSetting, Checkout |
| Site Config | Global, Home, Header, PDP |

---

*Generated from Strapi schema files - December 2024*
