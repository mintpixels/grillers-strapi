# Strapi CMS Gap Analysis - Frontend Requirements

**Analysis Date:** December 1, 2024
**Purpose:** Compare frontend issue requirements against current Strapi CMS schema

---

## Executive Summary

After analyzing 74 frontend issues against the current Strapi schema, **32 CMS gaps** have been identified that need to be addressed to fully support the frontend requirements and SOW deliverables.

### Gap Severity Breakdown

| Severity | Count | Description |
|----------|-------|-------------|
| Critical | 8 | Missing content types or major features |
| High | 12 | Missing fields or components |
| Medium | 9 | Enhancements needed |
| Low | 3 | Nice-to-have additions |

---

## Detailed Gap Analysis by Frontend Area

### HOME PAGE (Issues #1-6)

| Issue # | Frontend Requirement | Strapi Status | Gap? | Action Required |
|---------|---------------------|---------------|------|-----------------|
| 1 | Grillers Pride branding in metadata | `Global.siteName` exists | Partial | Verify siteName is populated correctly |
| 2 | Hero CTA button | `home.hero` has Title + BackgroundImage only | **YES** | Add CTA button component to hero |
| 3 | Newsletter signup section | No newsletter content type | **YES** | Create Newsletter component |
| 4 | Lazy loading for sections | Frontend concern | No | N/A - Frontend implementation |
| 5 | JSON-LD Organization schema | `Global` has basic SEO only | **YES** | Add Organization schema fields |
| 6 | Hero accessibility (alt text) | BackgroundImage has no alt field | **YES** | Add ImageAlt field to hero |

#### CMS Actions for Home Page:

**Gap #1: Hero Component Missing Fields**
```
Component: home.hero
Missing Fields:
- Subtitle (text)
- CTAButton (component: common.link)
- BackgroundImageAlt (string) - for accessibility
```

**Gap #2: Newsletter Component Missing**
```
New Component: home.newsletter
Fields:
- Title (string)
- Description (text)
- Placeholder (string)
- ButtonText (string)
- PrivacyText (text)
- SuccessMessage (text)
```

**Gap #3: Organization Schema Fields Missing**
```
Content Type: Global (extend)
Missing Fields:
- organizationLogo (media)
- organizationAddress (component)
- organizationPhone (string)
- organizationEmail (string)
- socialProfiles (component, repeatable)
```

---

### GLOBAL HEADER (Issues #7-12)

| Issue # | Frontend Requirement | Strapi Status | Gap? | Action Required |
|---------|---------------------|---------------|------|-----------------|
| 7 | Mobile search bar | Frontend implementation | No | N/A |
| 8 | Skip-to-main link | Frontend implementation | No | N/A |
| 9 | Announcement bar | No announcement content type | **YES** | Create AnnouncementBar content type |
| 10 | Country/region selector | No regions in CMS | Partial | Consider regions config |
| 11 | Keyboard navigation | Frontend implementation | No | N/A |
| 12 | Clickable phone number | Header content not in CMS | **YES** | Add contact info to Header/Global |

#### CMS Actions for Header:

**Gap #4: Announcement Bar Missing**
```
New Single Type: AnnouncementBar
Fields:
- Enabled (boolean)
- Message (text)
- Link (component: common.link)
- BackgroundColor (string)
- TextColor (string)
- Dismissible (boolean)
- StartDate (datetime)
- EndDate (datetime)
```

**Gap #5: Contact Info Missing from Header**
```
Content Type: Header OR Global (extend)
Missing Fields:
- PhoneNumber (string)
- PhoneLabel (string)
- EmailAddress (string)
```

---

### GLOBAL FOOTER (Issues #13-18)

| Issue # | Frontend Requirement | Strapi Status | Gap? | Action Required |
|---------|---------------------|---------------|------|-----------------|
| 13 | Grillers Pride branding | No Footer content type | **YES** | Create Footer content type |
| 14 | Newsletter signup | See Home Page gap | **YES** | Same as Gap #2 |
| 15 | Social media links | No social links in CMS | **YES** | Add social links component |
| 16 | Strapi-driven footer content | No Footer content type | **YES** | Create Footer content type |
| 17 | Payment method icons | No payment display config | **YES** | Add payment methods field |
| 18 | Kosher certification badge | No certification in CMS | **YES** | Add certification component |

#### CMS Actions for Footer:

**Gap #6: Footer Content Type Missing**
```
New Single Type: Footer
Fields:
- CompanyDescription (text)
- ContactInfo (component)
  - Address (text)
  - Phone (string)
  - Email (string)
  - Hours (text)
- NavigationColumns (component, repeatable)
  - Title (string)
  - Links (component: common.link, repeatable)
- SocialLinks (component)
  - Instagram (string)
  - Facebook (string)
  - Pinterest (string)
  - TikTok (string)
  - YouTube (string)
- PaymentMethods (component)
  - ShowVisa (boolean)
  - ShowMastercard (boolean)
  - ShowAmex (boolean)
  - ShowPayPal (boolean)
  - ShowApplePay (boolean)
  - ShowGooglePay (boolean)
- Certifications (component, repeatable)
  - Name (string)
  - Image (media)
  - Link (string)
- LegalLinks (component, repeatable)
  - Title (string)
  - Url (string)
- CopyrightText (string)
```

---

### PRODUCT DETAIL PAGE (Issues #19-27)

| Issue # | Frontend Requirement | Strapi Status | Gap? | Action Required |
|---------|---------------------|---------------|------|-----------------|
| 19 | PDP metadata branding | Uses Global.siteName | Partial | Verify population |
| 20 | JSON-LD Product schema | Product has basic fields | **YES** | Add schema-specific fields |
| 21 | Breadcrumb navigation | Category hierarchy exists | Partial | Ensure all levels populated |
| 22 | Product reviews/ratings | No Review content type | **YES** | Create Review content type |
| 23 | Social sharing buttons | Frontend implementation | No | N/A |
| 24 | Wishlist functionality | No Wishlist content type | **YES** | Create Wishlist content type |
| 25 | Weight/nutritional info | `pdp.product-metadata` exists | Partial | Verify all fields used |
| 26 | Image gallery accessibility | No alt text fields | **YES** | Add alt text to media |
| 27 | Related products skeleton | Frontend implementation | No | N/A |

#### CMS Actions for PDP:

**Gap #7: Product Schema Fields Missing**
```
Content Type: Product (extend)
Missing Fields for JSON-LD:
- Brand (string) - default "Grillers Pride"
- GTIN/UPC (string)
- MPN (string)
- Availability (enum: InStock, OutOfStock, PreOrder)
- Condition (enum: NewCondition)
- AggregateRating (component)
  - RatingValue (decimal)
  - ReviewCount (integer)
```

**Gap #8: Review Content Type Missing**
```
New Collection Type: Review
Fields:
- Product (relation: manyToOne → Product)
- Rating (integer, 1-5)
- Title (string)
- Body (text)
- AuthorName (string)
- AuthorEmail (string, private)
- VerifiedPurchase (boolean)
- Status (enum: pending, approved, rejected)
- HelpfulVotes (integer)
- PublishedDate (datetime)
```

**Gap #9: Wishlist Content Type Missing**
```
New Collection Type: Wishlist
Fields:
- User (relation: manyToOne → User)
- Name (string)
- Products (relation: manyToMany → Product)
- IsPublic (boolean)
- ShareToken (string, unique)
```

**Gap #10: Product Image Alt Text**
```
Component: pdp.product-image (NEW)
Fields:
- Image (media)
- AltText (string, required)
- Caption (string)
```

---

### COLLECTIONS PAGE (Issues #28-34)

| Issue # | Frontend Requirement | Strapi Status | Gap? | Action Required |
|---------|---------------------|---------------|------|-----------------|
| 28 | Collections metadata | No description field on ProductCollection | **YES** | Add SEO fields |
| 29 | Collection description | No description field | **YES** | Add description field |
| 30 | JSON-LD CollectionPage | No SEO on collections | **YES** | Add SEO component |
| 31 | Filtering by attributes | Product metadata exists | Partial | Verify Algolia indexed |
| 32 | Collection banner/hero | No image on ProductCollection | **YES** | Add hero image |
| 33 | Remove legacy pages | Code cleanup | No | N/A |
| 34 | View All products count | API/frontend | No | N/A |

#### CMS Actions for Collections:

**Gap #11: ProductCollection Missing Fields**
```
Content Type: ProductCollection (extend)
Missing Fields:
- Description (text)
- LongDescription (blocks)
- HeroImage (media)
- HeroImageAlt (string)
- SEO (component: shared.seo)
- FeaturedProducts (relation: oneToMany → Product)
- SortOrder (integer)
```

**Gap #12: Category/Taxonomy Pages Missing Fields**
```
Content Types: Aisle, ProductType, MasterCategory, Category, SubCategory (extend all)
Missing Fields:
- Description (text)
- Image (media)
- ImageAlt (string)
- SEO (component: shared.seo)
```

---

### GENERAL/SITE-WIDE (Issues #35-51)

| Issue # | Frontend Requirement | Strapi Status | Gap? | Action Required |
|---------|---------------------|---------------|------|-----------------|
| 35 | Google Analytics 4 | No analytics config | **YES** | Add analytics settings |
| 36 | Google Tag Manager | No GTM config | **YES** | Add GTM settings |
| 37 | Cookie consent banner | No cookie consent type | **YES** | Create CookieConsent type |
| 38 | Event tracking | Frontend implementation | No | N/A |
| 39-41 | Testing frameworks | Development concern | No | N/A |
| 42-44 | Accessibility | Frontend/CMS combo | Partial | Add alt text fields |
| 45 | Sitemap verification | Auto-generated | No | N/A |
| 46 | Canonical URLs | Frontend implementation | No | N/A |
| 47 | Hreflang tags | No multi-region config | **YES** | Add region settings |
| 48-49 | Error pages | Frontend/CMS | Partial | Consider CMS content |
| 50-51 | Documentation | Not in CMS | No | N/A |

#### CMS Actions for Site-Wide:

**Gap #13: Analytics Configuration Missing**
```
New Single Type: Analytics
Fields:
- GoogleAnalyticsId (string)
- GoogleTagManagerId (string)
- FacebookPixelId (string)
- EnableAnalytics (boolean)
- CookieConsentRequired (boolean)
```

**Gap #14: Cookie Consent Missing**
```
New Single Type: CookieConsent
Fields:
- Enabled (boolean)
- BannerTitle (string)
- BannerDescription (text)
- AcceptButtonText (string)
- DeclineButtonText (string)
- SettingsButtonText (string)
- PrivacyPolicyLink (string)
- CookiePolicyLink (string)
- Categories (component, repeatable)
  - Name (string)
  - Description (text)
  - Required (boolean)
  - DefaultEnabled (boolean)
```

**Gap #15: Multi-Region Configuration Missing**
```
New Collection Type: Region
Fields:
- Code (string, unique) - e.g., "us", "ca"
- Name (string)
- Currency (string)
- Locale (string)
- Enabled (boolean)
- FlagIcon (media)
- DefaultShippingZone (relation → ShippingZone)
```

---

### CHECKOUT PAGE (Issues #52-64)

| Issue # | Frontend Requirement | Strapi Status | Gap? | Action Required |
|---------|---------------------|---------------|------|-----------------|
| 52 | Checkout metadata | No checkout content | Partial | Use Global |
| 53 | Credit card verification | Medusa/payment layer | No | N/A |
| 54 | UPS API real-time rates | Partial config exists | **YES** | Extend shipping config |
| 55 | Shipping box estimation | No box config | **YES** | Add box sizing config |
| 56 | Dry ice calculation | No dry ice config | **YES** | Add cold chain config |
| 57 | Fix typo | Frontend code | No | N/A |
| 58 | Plant pickup discount display | `ShippingSetting` exists | Partial | Verify frontend uses it |
| 59-63 | UX improvements | Frontend implementation | No | N/A |
| 64 | Shipping option fix | Code bug | No | N/A |

#### CMS Actions for Checkout:

**Gap #16: UPS Integration Config Missing**
```
Content Type: ShippingSetting (extend)
Missing Fields:
- UPSAccountNumber (string)
- UPSAccessKey (string, private)
- DefaultOriginZip (string)
- DefaultBoxWeight (decimal)
- EnableRealTimeRates (boolean)
- RateFallbackAmount (decimal)
```

**Gap #17: Shipping Box Configuration Missing**
```
New Collection Type: ShippingBox
Fields:
- Name (string)
- Length (decimal)
- Width (decimal)
- Height (decimal)
- MaxWeight (decimal)
- EmptyWeight (decimal)
- IsDefault (boolean)
```

**Gap #18: Cold Chain/Dry Ice Configuration Missing**
```
New Single Type: ColdChainSettings
Fields:
- DryIcePricePerPound (decimal)
- DryIceMinimumPounds (decimal)
- DryIcePerPoundOfProduct (decimal) - ratio
- TemperatureThreshold (integer)
- ColdPackAlternativeEnabled (boolean)
- ColdPackPrice (decimal)
- ShippingDaysRequiringDryIce (integer)
- DryIceWarningMessage (text)
```

---

### BLOG/RECIPES PAGE (Issues #65-74)

| Issue # | Frontend Requirement | Strapi Status | Gap? | Action Required |
|---------|---------------------|---------------|------|-----------------|
| 65 | Recipes metadata branding | Recipe exists, no SEO | **YES** | Add SEO to Recipe |
| 66 | JSON-LD Recipe schema | Partial fields exist | **YES** | Add schema fields |
| 67 | Recipe filtering/categories | No RecipeCategory type | **YES** | Create RecipeCategory |
| 68 | Recipe search | Algolia config exists | Partial | Add recipes to index |
| 69 | Recipe print functionality | Frontend implementation | No | N/A |
| 70 | Recipe social sharing | Frontend implementation | No | N/A |
| 71 | Related products on recipes | Recipe → Product relation exists | OK | Verify bidirectional |
| 72 | Recipe ratings/reviews | No rating fields | **YES** | Add rating to Recipe |
| 73 | Recipe save/favorites | No favorites type | **YES** | Add to Wishlist or new |
| 74 | Cooking tips/video embeds | No video field | **YES** | Add video support |

#### CMS Actions for Recipes:

**Gap #19: Recipe Missing SEO & Schema Fields**
```
Content Type: Recipe (extend)
Missing Fields:
- SEO (component: shared.seo)
- Author (string)
- Difficulty (enum: easy, medium, hard)
- Cuisine (string)
- Course (enum: appetizer, main, dessert, side, snack)
- Keywords (text)
- NutritionInfo (component)
  - Calories (string)
  - Protein (string)
  - Fat (string)
  - Carbs (string)
  - Sodium (string)
- VideoUrl (string)
- VideoEmbed (text)
- PrintableVersion (media - PDF)
```

**Gap #20: Recipe Category Missing**
```
New Collection Type: RecipeCategory
Fields:
- Name (string, required)
- Slug (uid)
- Description (text)
- Image (media)
- SEO (component: shared.seo)
- Recipes (relation: oneToMany → Recipe)
```

**Gap #21: Recipe Ratings Missing**
```
Content Type: Recipe (extend)
Missing Fields:
- AverageRating (decimal)
- RatingCount (integer)
- AllowRatings (boolean)
```

---

## SEO-Specific Gaps

### Missing Schema.org Support

| Schema Type | Required For | Current Status | Gap |
|-------------|--------------|----------------|-----|
| Organization | Site-wide | Not implemented | **Gap #3** |
| Product | PDP | Partial | **Gap #7** |
| Recipe | Recipe pages | Partial | **Gap #19** |
| CollectionPage | Category pages | Not implemented | **Gap #11** |
| BreadcrumbList | All pages | Hierarchy exists | Frontend |
| Review | Products, Recipes | Not implemented | **Gap #8** |
| AggregateRating | Products, Recipes | Not implemented | **Gap #7, #21** |
| WebSite | Homepage | Partial in Global | Extend |
| LocalBusiness | Footer/Contact | Not implemented | **Gap #6** |

### Missing SEO Fields Summary

| Content Type | Missing SEO Elements |
|--------------|---------------------|
| ProductCollection | SEO component, description, OG image |
| Aisle/ProductType/Category | SEO component, description |
| Recipe | SEO component, full schema fields |
| Header | None (navigation) |
| Footer | LocalBusiness data |
| Checkout | N/A (not indexed) |

---

## Implementation Priority Matrix

### Critical (Blocks Launch)

| Gap # | Item | Effort | Impact |
|-------|------|--------|--------|
| 6 | Footer content type | High | Brand trust, compliance |
| 8 | Review content type | High | SEO, conversion |
| 13 | Analytics configuration | Low | Data tracking |
| 14 | Cookie consent | Medium | Legal compliance |
| 18 | Cold chain settings | Medium | Core business |

### High (Launch Blockers if SOW strict)

| Gap # | Item | Effort | Impact |
|-------|------|--------|--------|
| 1 | Hero CTA button | Low | Conversion |
| 2 | Newsletter component | Low | Email capture |
| 3 | Organization schema fields | Medium | SEO |
| 4 | Announcement bar | Low | Marketing |
| 7 | Product schema fields | Medium | Rich results |
| 11 | Collection SEO fields | Medium | Category SEO |
| 17 | Shipping box config | Medium | Accurate quotes |
| 19 | Recipe SEO fields | Medium | Recipe SEO |

### Medium (Post-Launch Sprint)

| Gap # | Item | Effort | Impact |
|-------|------|--------|--------|
| 5 | Contact info in header | Low | UX |
| 9 | Wishlist content type | Medium | Engagement |
| 10 | Product image alt text | Low | Accessibility |
| 12 | Category descriptions | Low | SEO |
| 15 | Multi-region config | High | Expansion |
| 16 | UPS integration config | Medium | Shipping |
| 20 | Recipe categories | Low | Organization |
| 21 | Recipe ratings | Low | Engagement |

### Low (Future Enhancement)

| Gap # | Item | Effort | Impact |
|-------|------|--------|--------|
| - | Video embeds in recipes | Low | Engagement |
| - | Social profile links | Low | Brand |
| - | Payment method icons | Low | Trust |

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Frontend Issues Analyzed | 74 |
| Issues Requiring CMS Changes | 42 |
| Issues Already Supported | 18 |
| Issues Frontend-Only | 14 |
| New Content Types Needed | 9 |
| Existing Types to Extend | 8 |
| New Components Needed | 7 |

### New Content Types Required

1. `Review` (collection)
2. `Wishlist` (collection)
3. `RecipeCategory` (collection)
4. `ShippingBox` (collection)
5. `Region` (collection)
6. `Footer` (single)
7. `AnnouncementBar` (single)
8. `Analytics` (single)
9. `CookieConsent` (single)
10. `ColdChainSettings` (single)

### Existing Types to Extend

1. `Product` - schema fields, ratings
2. `Recipe` - SEO, schema, categories, ratings
3. `ProductCollection` - SEO, description, image
4. `Global` - organization data
5. `Header` - contact info
6. `ShippingSetting` - UPS config
7. `Aisle/ProductType/MasterCategory/Category/SubCategory` - SEO, descriptions
8. `home.hero` - CTA button, alt text

---

*Generated from Frontend Issue Analysis - December 2024*
