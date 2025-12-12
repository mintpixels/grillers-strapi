# SEO Strategy Documentation

## Overview
This document outlines the comprehensive SEO implementation for Grillers Pride, designed for traditional search engines, AI-powered search (ChatGPT, Perplexity, Google SGE), and social media platforms.

---

## Component Structure

### 1. **SEO Component** (`shared.seo`)
Core technical SEO fields for search engine and AI indexing.

#### Fields:

| Field | Type | Required | Purpose | Best Practice |
|-------|------|----------|---------|---------------|
| `metaTitle` | String (60 char max) | ✅ Yes | Page title for search results | 50-60 characters, include primary keyword |
| `metaDescription` | Text (160 char max) | ✅ Yes | Description in search results | 50-160 characters, compelling call-to-action |
| `keywords` | String | ❌ No | Target keywords (legacy but useful) | Comma-separated, 5-10 keywords max |
| `canonicalUrl` | String | ❌ No | Preferred URL for duplicate content | Use for filtered/paginated pages |
| `metaRobots` | Enum | ✅ Yes | Crawling instructions | Default: "index, follow" |
| `structuredData` | JSON | ❌ No | Schema.org JSON-LD | Product, Recipe, Organization schemas |
| `metaViewport` | String | ❌ No | Viewport settings | Default: "width=device-width, initial-scale=1" |

#### Robots Options:
- **`index, follow`** - Default for all public content
- **`noindex, follow`** - For checkout, thank you pages, duplicate content
- **`index, nofollow`** - Rarely used
- **`noindex, nofollow`** - For private/sensitive pages

---

### 2. **Social Meta Component** (`shared.social-meta`)
Open Graph and Twitter Card metadata for social sharing.

#### Fields:

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `ogTitle` | String (60 char max) | ❌ No | Facebook/LinkedIn share title (fallback to metaTitle) |
| `ogDescription` | Text (200 char max) | ❌ No | Facebook/LinkedIn description (fallback to metaDescription) |
| `ogImage` | Media | ❌ No | Share preview image (1200x630px ideal) |
| `ogImageAlt` | String (100 char) | ❌ No | Alt text for accessibility and AI |
| `ogType` | Enum | ❌ No | Content type: website, article, product, profile |
| `twitterCard` | Enum | ❌ No | Card type: summary or summary_large_image |
| `twitterTitle` | String (70 char max) | ❌ No | Twitter-specific title (fallback to ogTitle) |
| `twitterDescription` | Text (200 char max) | ❌ No | Twitter description (fallback to ogDescription) |
| `twitterImage` | Media | ❌ No | Twitter card image (fallback to ogImage) |
| `twitterImageAlt` | String (100 char) | ❌ No | Alt text for Twitter image |
| `twitterCreator` | String | ❌ No | Twitter handle of content creator (@username) |
| `twitterSite` | String | ❌ No | Twitter handle of website (@GrillersPride) |

---

## Content Type Implementation

### Where SEO + SocialMeta is Applied:

| Content Type | SEO Component | Social Meta | Typical Robots | Notes |
|--------------|---------------|-------------|----------------|-------|
| **Home** | ✅ | ✅ | index, follow | Critical for brand visibility |
| **Product** | ✅ | ✅ | index, follow | Use Product schema in structuredData |
| **Recipe** | ✅ | ✅ | index, follow | Use Recipe schema in structuredData |
| **ProductCollection** | ✅ | ✅ | index, follow | Use CollectionPage schema |
| **Checkout** | ✅ | ❌ | noindex, follow | Privacy + prevent indexing cart states |
| **Global** | ✅ (defaultSeo) | ❌ | N/A | Fallback values site-wide |

---

## AI/LLM Optimization Strategy

### For AI Search Engines (ChatGPT, Perplexity, Google SGE):

#### 1. **Structured Data is Critical**
AI engines heavily rely on schema.org markup to understand content context.

**Recommended Schemas:**

**Products:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Grillers Pride"
  },
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD"
  }
}
```

**Recipes:**
```json
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Recipe Name",
  "description": "Recipe description",
  "recipeIngredient": ["ingredient1", "ingredient2"],
  "recipeInstructions": ["step1", "step2"],
  "prepTime": "PT15M",
  "cookTime": "PT30M"
}
```

**Organization (Global):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Grillers Pride",
  "url": "https://grillerspride.com",
  "logo": "https://grillerspride.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-xxx-xxx-xxxx",
    "contactType": "Customer Service"
  }
}
```

#### 2. **Clear, Semantic Descriptions**
- Write meta descriptions that clearly explain **what** the page is about
- Use natural language that answers questions
- Include key facts AI can extract (price, ingredients, cooking time)

#### 3. **Alt Text & Image Descriptions**
- Multimodal AI (GPT-4V, Claude) can read images
- Comprehensive alt text helps AI understand product images
- Use `ogImageAlt` and `twitterImageAlt` for social images

#### 4. **Canonical URLs**
- Prevent AI from seeing duplicate content
- Use for filtered category pages (e.g., `/products?kosher=true` → `/products`)
- Use for paginated content

---

## Best Practices by Content Type

### **Homepage**
```
SEO:
  metaTitle: "Grillers Pride - Premium Kosher Meats & BBQ Products"
  metaDescription: "Shop premium kosher steaks, burgers, and BBQ essentials. Family-owned, expertly sourced, delivered fresh to your door."
  metaRobots: "index, follow"
  
SocialMeta:
  ogType: "website"
  ogImage: [Hero image with products]
  twitterCard: "summary_large_image"
```

### **Product Pages**
```
SEO:
  metaTitle: "{Product Name} - Premium Kosher {Category} | Grillers Pride"
  metaDescription: "{Product description with key details}. Order online for fresh delivery."
  metaRobots: "index, follow"
  structuredData: [Product schema with price, availability, ratings]
  
SocialMeta:
  ogType: "product"
  ogImage: [Product hero image]
  twitterCard: "summary_large_image"
```

### **Recipe Pages**
```
SEO:
  metaTitle: "{Recipe Name} Recipe - Easy Kosher {Dish Type}"
  metaDescription: "Learn to make {recipe name} with this simple {prep time} minute recipe. Perfect for {occasion}."
  metaRobots: "index, follow"
  structuredData: [Recipe schema with ingredients, steps, times]
  
SocialMeta:
  ogType: "article"
  ogImage: [Beautiful food photo]
  twitterCard: "summary_large_image"
```

### **Collection Pages**
```
SEO:
  metaTitle: "{Collection Name} - Kosher {Category} | Grillers Pride"
  metaDescription: "Browse our selection of {collection description}. Shop premium kosher products with fast delivery."
  metaRobots: "index, follow"
  canonicalUrl: "/collections/{slug}" (if filters applied)
  structuredData: [CollectionPage schema]
  
SocialMeta:
  ogType: "website"
  ogImage: [Collection banner or featured products]
  twitterCard: "summary_large_image"
```

### **Checkout**
```
SEO:
  metaTitle: "Checkout - Grillers Pride"
  metaDescription: "Complete your order securely."
  metaRobots: "noindex, follow"
  
SocialMeta: Not needed (checkout shouldn't be shared)
```

---

## Image Optimization for SEO & AI

### Social Share Images (OG/Twitter):
- **Dimensions:** 1200x630px (1.91:1 ratio)
- **Format:** JPG or PNG (< 1MB)
- **Content:** Include product, text overlay with brand name
- **Alt text:** Describe image for accessibility and AI

### Product Images:
- **Multiple angles:** Hero, detail shots, in-use
- **High quality:** 1000x1000px minimum
- **Alt text:** "{Product Name} - {Key visual detail}"
- Example: "Grillers Pride ribeye steak on wooden cutting board"

---

## Technical SEO Considerations

### 1. **Canonical URLs**
Use when:
- Category pages have filters (`/products?type=beef` → `/products`)
- Pagination (`/recipes?page=2` → `/recipes`)
- Duplicate content exists

### 2. **Robots Meta**
- **Homepage, Products, Recipes, Collections:** `index, follow`
- **Checkout, Cart, Thank You:** `noindex, follow`
- **User Accounts, Orders:** `noindex, nofollow`

### 3. **Structured Data Testing**
- Use [Google Rich Results Test](https://search.google.com/test/rich-results)
- Validate [Schema.org markup](https://validator.schema.org/)
- Test with [OpenGraph Debugger](https://www.opengraph.xyz/)

### 4. **Keywords**
While "keywords" meta tag is legacy for Google, it's still valuable for:
- Internal reference (document target keywords)
- Some AI engines still reference it
- Bing and other search engines

---

## Social Media Image Specifications

| Platform | Optimal Size | Aspect Ratio | Format | Notes |
|----------|--------------|--------------|---------|-------|
| Facebook | 1200x630px | 1.91:1 | JPG/PNG | Max 8MB |
| Twitter | 1200x675px | 16:9 | JPG/PNG | Max 5MB |
| LinkedIn | 1200x627px | 1.91:1 | JPG/PNG | Max 5MB |
| Pinterest | 1000x1500px | 2:3 | JPG/PNG | Vertical preferred |

**Pro Tip:** Use 1200x630px for all platforms - it works universally.

---

## Frontend Implementation Checklist

### Required in Next.js Head:
```jsx
// Basic SEO
<title>{seo.metaTitle}</title>
<meta name="description" content={seo.metaDescription} />
<meta name="keywords" content={seo.keywords} />
<meta name="robots" content={seo.metaRobots} />
{seo.canonicalUrl && <link rel="canonical" href={seo.canonicalUrl} />}

// Open Graph
<meta property="og:title" content={socialMeta.ogTitle || seo.metaTitle} />
<meta property="og:description" content={socialMeta.ogDescription || seo.metaDescription} />
<meta property="og:image" content={socialMeta.ogImage?.url} />
<meta property="og:image:alt" content={socialMeta.ogImageAlt} />
<meta property="og:type" content={socialMeta.ogType} />
<meta property="og:url" content={canonicalUrl} />

// Twitter
<meta name="twitter:card" content={socialMeta.twitterCard} />
<meta name="twitter:title" content={socialMeta.twitterTitle || socialMeta.ogTitle} />
<meta name="twitter:description" content={socialMeta.twitterDescription || socialMeta.ogDescription} />
<meta name="twitter:image" content={socialMeta.twitterImage?.url || socialMeta.ogImage?.url} />
<meta name="twitter:image:alt" content={socialMeta.twitterImageAlt || socialMeta.ogImageAlt} />
<meta name="twitter:creator" content={socialMeta.twitterCreator} />
<meta name="twitter:site" content={socialMeta.twitterSite} />

// Structured Data
{seo.structuredData && (
  <script type="application/ld+json">
    {JSON.stringify(seo.structuredData)}
  </script>
)}
```

---

## Testing & Validation

### Tools:
1. **Google Search Console** - Monitor indexing and performance
2. **Google Rich Results Test** - Validate structured data
3. **Facebook Sharing Debugger** - Test OG tags
4. **Twitter Card Validator** - Test Twitter cards
5. **Schema.org Validator** - Validate JSON-LD
6. **Lighthouse** - Audit SEO scores

### Pre-Launch Checklist:
- [ ] All public pages have unique meta titles
- [ ] Meta descriptions are 50-160 characters
- [ ] All images have alt text
- [ ] Structured data validates without errors
- [ ] Social share images are 1200x630px
- [ ] Checkout and cart pages are noindexed
- [ ] Canonical URLs set for filtered/paginated pages
- [ ] Twitter and OG tags tested with debuggers

---

## Monitoring & Optimization

### Monthly Tasks:
1. Review Google Search Console for:
   - Indexing errors
   - Coverage issues
   - Mobile usability
2. Check social share previews on key pages
3. Validate structured data markup
4. Monitor keyword rankings
5. Update meta descriptions based on CTR data

### Quarterly Tasks:
1. Audit all meta titles for uniqueness
2. Update structured data schemas
3. Refresh social share images
4. Review and update keywords based on search trends
5. Test AI engine results (ChatGPT, Perplexity)

---

## AI-Specific Optimization Notes

### For ChatGPT Search / Perplexity:
- Focus on **factual, clear content** in descriptions
- Use structured data for **extractable facts** (prices, ingredients, times)
- Include **"how-to" language** in recipe descriptions
- Add **specifications** to product descriptions (weight, dimensions, certifications)

### For Google SGE (Search Generative Experience):
- Optimize for **featured snippets** with clear, concise answers
- Use **FAQ schema** for common questions
- Include **step-by-step instructions** in recipes
- Add **comparison data** where relevant

---

## Questions or Issues?

For implementation questions, refer to:
- Strapi documentation: https://docs.strapi.io/
- Schema.org documentation: https://schema.org/
- Open Graph protocol: https://ogp.me/
- Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards


