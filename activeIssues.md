# Active Strapi Issues

This document tracks the Strapi CMS issues to be implemented for the Grillers Pride project.

---

## Existing GitHub Issues (In Priority Order)

### 1. Issue #81 - Create Footer Single Type

**GitHub:** https://github.com/mintpixels/grillers-documentation/issues/81

**Priority:** Critical (blocks #14)

**Labels:** `critical`, `footer`, `strapi-cms`, `content-type`

#### Description
Create a new single type for managing footer content.

#### Related Frontend Issues
- #14 [Footer] Replace Medusa branding with Grillers Pride
- #15 [Footer] Add newsletter signup form
- #16 [Footer] Add social media links section
- #17 [Footer] Add Strapi-driven footer content
- #18 [Footer] Add payment method icons
- #19 [Footer] Add kosher certification badge

#### SOW Reference
> DTC Storefront UI/UX

#### Requirements
Create single type with:
- Navigation columns (repeatable with title + links)
- Social media links component
- Contact information
- Legal links (Privacy, Terms, etc.)
- Payment methods component
- Certification badges
- Copyright text
- Newsletter section toggle

#### Acceptance Criteria
- [ ] Footer single type created
- [ ] All sections configurable from Strapi
- [ ] Content editable without code deployment

---

### 2. Issue #98 - Add SEO Component to Recipe

**GitHub:** https://github.com/mintpixels/grillers-documentation/issues/98

**Priority:** High (blocks #66)

**Labels:** `high-priority`, `recipes`, `seo`, `strapi-cms`, `extension`

#### Description
Add SEO component to Recipe for meta tags and structured data.

#### Related Frontend Issue
- #66 [Recipes] Update metadata with Grillers Pride branding

#### SOW Reference
> SEO Strategy

#### Fields to Add
- SEO: component (shared.seo)

#### File to Modify
`src/api/recipe/content-types/recipe/schema.json`

#### Acceptance Criteria
- [ ] SEO component added to Recipe
- [ ] Meta title, description configurable per recipe

---

### 3. Issue #107 - Add SEO Component to ProductCollection

**GitHub:** https://github.com/mintpixels/grillers-documentation/issues/107

**Priority:** High (blocks #29)

**Labels:** `high-priority`, `collections`, `seo`, `strapi-cms`, `extension`

#### Description
Add SEO component to ProductCollection for meta tags and schema.

#### Related Frontend Issues
- #29 [Collections] Update metadata to use Grillers Pride branding
- #31 [Collections] Add JSON-LD CollectionPage structured data

#### SOW Reference
> SEO Strategy

#### Fields to Add
- SEO: component (shared.seo)

#### File to Modify
`src/api/product-collection/content-types/product-collection/schema.json`

#### Acceptance Criteria
- [ ] SEO component added to ProductCollection
- [ ] Meta tags configurable per collection

---

## Missing Issues - Prompts to Create

The following issues need to be created in the GitHub repository.

### 1. HomePage SEO (blocks #2)

**Suggested Title:** `[Strapi] Add SEO component to Home single type`

**Suggested Labels:** `high-priority`, `seo`, `strapi-cms`, `extension`

#### Description
Add SEO component to Home single type for homepage meta tags and structured data.

#### Related Frontend Issue
- #2 (HomePage metadata/SEO)

#### SOW Reference
> SEO Strategy

#### Fields to Add
- SEO: component (shared.seo)

#### File to Modify
`src/api/home/content-types/home/schema.json`

#### Acceptance Criteria
- [ ] SEO component added to Home single type
- [ ] Homepage meta title, description configurable from Strapi

---

### 2. Product SEO (blocks #20)

**Suggested Title:** `[Strapi] Add SEO component to Product content type`

**Suggested Labels:** `high-priority`, `seo`, `strapi-cms`, `extension`

#### Description
Add SEO component to Product collection type for product page meta tags and structured data.

#### Related Frontend Issue
- #20 (Product page metadata/SEO)

#### SOW Reference
> SEO Strategy

#### Fields to Add
- SEO: component (shared.seo)

#### File to Modify
`src/api/product/content-types/product/schema.json`

#### Acceptance Criteria
- [ ] SEO component added to Product
- [ ] Product meta title, description, share image configurable per product

---

### 3. Checkout Metadata (#53)

**Suggested Title:** `[Strapi] Verify Global settings support checkout metadata`

**Suggested Labels:** `medium-priority`, `checkout`, `strapi-cms`

#### Description
Ensure checkout page can pull metadata from Global site settings rather than requiring a checkout-specific CMS entry.

#### Related Frontend Issue
- #53 (Checkout metadata)

#### Analysis
**Current Global Single Type Fields:**
- `siteName` (string, required) ✅
- `siteDescription` (text, required) ✅
- `favicon` (media) ✅
- `defaultSeo` (component: shared.seo) ✅

The Global single type already contains all necessary fields for checkout metadata:
- Site name for page titles
- Site description for meta descriptions
- Default SEO component with metaTitle, metaDescription, shareImage

#### Recommendation
**No Strapi changes required.** The frontend should read checkout metadata from the existing Global single type rather than creating checkout-specific CMS entries.

#### Acceptance Criteria
- [ ] Verify frontend checkout page reads metadata from Global settings
- [ ] Document that Global.defaultSeo or Global.siteName/siteDescription should be used for checkout

---

## Implementation Notes

### Existing SEO Component Structure
The `shared.seo` component (`src/components/shared/seo.json`) is already defined with:

```json
{
  "attributes": {
    "metaTitle": {
      "type": "string",
      "required": true
    },
    "metaDescription": {
      "type": "text",
      "required": true
    },
    "shareImage": {
      "type": "media",
      "multiple": false,
      "required": false,
      "allowedTypes": ["images"]
    }
  }
}
```

### Pattern for Adding SEO to Content Types
Add the following to any content type's `attributes` in its schema.json:

```json
"SEO": {
  "type": "component",
  "repeatable": false,
  "component": "shared.seo"
}
```

### Current Global Settings
The Global single type (`src/api/global/content-types/global/schema.json`) already provides:
- `siteName` - Site name for branding
- `siteDescription` - Site-wide description
- `favicon` - Site favicon
- `defaultSeo` - Default SEO settings (shared.seo component)

These can be used as fallbacks when page-specific SEO is not set.

