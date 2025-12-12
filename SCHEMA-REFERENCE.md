# Strapi CMS Schema Reference

## Content Type Hierarchy

```
📁 Single Types (Global Settings)
├── 🌐 Global (#108) ✅ Already exists
│   ├── Organization component (address, phone, email)
│   └── SEO defaults
│
├── 🏠 Home
│   └── 🎭 Hero Component (#93, #94, #95) ✅ Enhanced
│       ├── Title
│       ├── Subtitle ⭐ NEW
│       ├── Background Image
│       ├── Background Image Alt ⭐ NEW
│       └── CTA Button (common.link)
│
├── 📋 Header (#109) ✅ Enhanced
│   ├── Header Nav (repeatable)
│   ├── Phone Number ⭐ NEW
│   └── Phone Label ⭐ NEW
│
├── 🛒 Checkout
│   ├── Shipping Blackout Days/Dates
│   ├── Delivery Lead Time
│   └── SEO
│
├── 📦 Shipping Setting (#110) ✅ Enhanced
│   ├── Plant Pickup settings (existing)
│   ├── UPS Account Number ⭐ NEW
│   ├── Enable Real Time Rates ⭐ NEW
│   ├── Default Origin Zip ⭐ NEW
│   └── Rate Fallback Amount ⭐ NEW
│
└── ❄️ Cold Chain Settings (#85) ⭐ NEW
    ├── Dry Ice Price Per Lb
    ├── Minimum Dry Ice Amount
    ├── Temperature Threshold
    ├── Cold Chain Surcharge
    ├── Enabled
    └── Transit Day Thresholds (repeatable)
        ├── Transit Days
        └── Dry Ice Multiplier

📚 Collection Types (Multiple Entries)
├── 🛍️ ProductCollection (#105, #106) ✅ Enhanced
│   ├── Name, Slug
│   ├── Description ⭐ NEW
│   ├── Long Description ⭐ NEW
│   ├── Hero Image ⭐ NEW
│   ├── Hero Image Alt ⭐ NEW
│   ├── SEO
│   └── Social Meta
│
├── 📦 ShippingBox (#79) ⭐ NEW
│   ├── Name (unique)
│   ├── Dimensions (L × W × H)
│   ├── Max Weight
│   ├── Tare Weight
│   └── Active
│
├── 🌍 Region (#80) ⭐ NEW
│   ├── Region Code (unique, e.g., "us", "ca")
│   ├── Region Name
│   ├── Currency Code
│   ├── Locale
│   ├── Flag Image
│   ├── Active
│   └── Is Default
│
├── 🏷️ Tag (#207) ⭐ NEW
│   ├── Name (unique)
│   ├── Slug
│   ├── Description
│   ├── Color
│   ├── Is Active
│   └── ↔️ Testimonials (many-to-many)
│
├── 💬 Testimonial (#205) ⭐ NEW
│   ├── Customer Info
│   │   ├── Name (required)
│   │   ├── Title
│   │   ├── Company
│   │   ├── Location
│   │   └── Photo
│   ├── Content
│   │   ├── Testimonial Text (required)
│   │   ├── Featured Quote
│   │   └── Rating (1-5)
│   ├── Metadata
│   │   ├── Date Received (required)
│   │   ├── Display Order
│   │   └── Is Active
│   └── Filtering
│       ├── ↔️ Tags (many-to-many)
│       └── Categories (enum)
│
└── ❤️ Wishlist (#77) ⭐ NEW
    ├── Medusa Customer Id (unique)
    ├── ↔️ Products (many-to-many)
    └── ↔️ Recipes (many-to-many)
```

---

## Component Library

```
📦 Shared Components (Reusable across content types)

├── 🔗 shared.link
│   ├── Text
│   └── Url
│
├── 🔍 shared.seo
│   ├── Meta Title
│   ├── Meta Description
│   ├── Keywords
│   ├── Canonical URL
│   ├── Meta Robots
│   └── Structured Data (JSON)
│
├── 🏢 shared.organization
│   ├── Street Address
│   ├── City, State, Postal Code
│   ├── Country
│   ├── Phone
│   ├── Email
│   └── Social Profiles (JSON)
│
├── 🎖️ shared.certification (#90) ⭐ NEW
│   ├── Name
│   ├── Badge Image
│   ├── Alt Text
│   └── Link URL
│
├── 📱 shared.social-links (#88) ⭐ NEW
│   ├── Instagram
│   ├── Facebook
│   ├── Pinterest
│   ├── TikTok
│   ├── Twitter
│   └── YouTube
│
├── 💳 shared.payment-methods (#89) ⭐ NEW
│   ├── Show Visa
│   ├── Show Mastercard
│   ├── Show Amex
│   ├── Show Discover
│   ├── Show PayPal
│   ├── Show Apple Pay
│   └── Show Google Pay
│
└── 💬 shared.testimonial-section (#206) ⭐ NEW
    ├── Display Config
    │   ├── Title, Subtitle
    │   ├── Display Style (carousel/grid/featured/list)
    │   ├── Items To Show
    │   ├── Show Ratings
    │   ├── Show Photos
    │   └── Background Color
    ├── Filtering
    │   ├── ↔️ Filter By Tags
    │   ├── Filter By Categories
    │   └── Sort Order
    └── CTA
        ├── Show All Link
        └── All Link URL

📦 PDP Components (Product Detail Page)

├── 🖼️ pdp.product-image (#91) ⭐ NEW
│   ├── Image (required)
│   ├── Alt Text (required)
│   ├── Caption
│   ├── Is Primary
│   └── Sort Order
│
└── ... (existing medusa/metadata components)

📦 Home Components

├── 🎭 home.hero (see above)
├── 🏆 home.bestsellers
├── 📝 home.blog-explore
└── ... (other existing components)

📦 Checkout Components

├── 📅 checkout.shipping-blackout-dates
│
└── 🥶 checkout.transit-threshold (#85) ⭐ NEW
    ├── Transit Days
    └── Dry Ice Multiplier
```

---

## Relationship Diagram

```
┌─────────────────────────────────────────────────────┐
│                   TESTIMONIAL SYSTEM                │
└─────────────────────────────────────────────────────┘

    📊 Tag ←──── many-to-many ────→ 💬 Testimonial
      │                                    │
      │                                    │
      └──→ Used for filtering         Display via ←┘
           (beef, pork, quality)      TestimonialSection
                                      component


┌─────────────────────────────────────────────────────┐
│                    WISHLIST SYSTEM                  │
└─────────────────────────────────────────────────────┘

    ❤️ Wishlist ─────→ many-to-many ────→ 🛍️ Product
         │
         └─────────→ many-to-many ────→ 🍳 Recipe


┌─────────────────────────────────────────────────────┐
│                   SHIPPING SYSTEM                   │
└─────────────────────────────────────────────────────┘

    📦 ShippingBox ←── Used for ──→ Rate Calculation
                                          ↓
    📦 Shipping Setting ──→ UPS Integration
                                          ↓
    ❄️ Cold Chain Settings ──→ Dry Ice Calculation
```

---

## Field Type Reference

| Icon | Field Type | Description |
|------|-----------|-------------|
| 📝 | string | Single-line text |
| 📄 | text | Multi-line text |
| 🔢 | integer | Whole number |
| 💰 | decimal | Decimal number |
| ✅ | boolean | True/false toggle |
| 📅 | date | Date picker |
| 🖼️ | media | File/image upload |
| 🎨 | blocks | Rich text editor |
| 📋 | enumeration | Fixed dropdown options |
| 🔗 | component | Nested component |
| ↔️ | relation | Link to other content |
| 🆔 | uid | Auto-generated slug |
| 🔐 | private | Hidden from API |

---

## GitHub Issue Mapping

| Phase | Issue | Type | Status |
|-------|-------|------|--------|
| **Content Enhancements** |
| 1 | #105 | ProductCollection Description | ✅ Complete |
| 1 | #106 | ProductCollection Hero Image | ✅ Complete |
| 1 | #93 | Home Hero CTA Button | ✅ Already Exists |
| 1 | #94 | Home Hero Subtitle | ✅ Complete |
| 1 | #95 | Home Hero Alt Text | ✅ Complete |
| 1 | #109 | Header Phone Fields | ✅ Complete |
| **Shipping Infrastructure** |
| 2 | #110 | ShippingSetting UPS Fields | ✅ Complete |
| 2 | #79 | ShippingBox Collection | ✅ Complete |
| 2 | #85 | ColdChainSettings Single Type | ✅ Complete |
| **Components** |
| 3 | #91 | PDP Product Image | ✅ Complete |
| 3 | #90 | Shared Certification | ✅ Complete |
| 3 | #88 | Shared Social Links | ✅ Complete |
| 3 | #89 | Shared Payment Methods | ✅ Complete |
| **Multi-Region** |
| 4 | #80 | Region Collection | ✅ Complete |
| **Testimonials** |
| 5 | #207 | Tag Collection (Foundation) | ✅ Complete |
| 5 | #205 | Testimonial Collection | ✅ Complete |
| 5 | #206 | TestimonialSection Component | ✅ Complete |
| 5 | #208 | Frontend Implementation | 🔜 Next Phase |
| **User Features** |
| 6 | #77 | Wishlist Collection | ✅ Complete |

---

## API Endpoints (Auto-generated)

### Collection Types

```
GET    /api/product-collections
GET    /api/product-collections/:id
POST   /api/product-collections
PUT    /api/product-collections/:id
DELETE /api/product-collections/:id

GET    /api/shipping-boxes
GET    /api/shipping-boxes/:id
POST   /api/shipping-boxes
PUT    /api/shipping-boxes/:id
DELETE /api/shipping-boxes/:id

GET    /api/regions
GET    /api/regions/:id
POST   /api/regions
PUT    /api/regions/:id
DELETE /api/regions/:id

GET    /api/tags
GET    /api/tags/:id
POST   /api/tags
PUT    /api/tags/:id
DELETE /api/tags/:id

GET    /api/testimonials
GET    /api/testimonials/:id
POST   /api/testimonials
PUT    /api/testimonials/:id
DELETE /api/testimonials/:id

GET    /api/wishlists
GET    /api/wishlists/:id
POST   /api/wishlists
PUT    /api/wishlists/:id
DELETE /api/wishlists/:id
```

### Single Types

```
GET    /api/header
PUT    /api/header

GET    /api/shipping-setting
PUT    /api/shipping-setting

GET    /api/cold-chain-settings
PUT    /api/cold-chain-settings
```

---

## Quick Search

**Need to add phone number to header?**
→ Header single type (#109)

**Want to display customer testimonials?**
→ Create Testimonial (#205) + Use TestimonialSection component (#206)

**Setting up shipping rates?**
→ ShippingSetting (#110) + ShippingBox (#79)

**Cold chain shipping for frozen products?**
→ ColdChainSettings (#85)

**Multi-country support?**
→ Region collection (#80)

**Tag/categorize content?**
→ Tag collection (#207)

**User favorites?**
→ Wishlist collection (#77)

**Product image gallery with accessibility?**
→ pdp.product-image component (#91)

**Collection landing pages?**
→ ProductCollection Description/Hero (#105, #106)

**Display payment methods?**
→ shared.payment-methods component (#89)

---

## Version History

- **v1.0** - December 12, 2025 - Initial implementation
  - 16 GitHub issues addressed
  - 44 files created/modified
  - 8 new collection types
  - 2 new single types
  - 6 new components
  - 4 enhanced existing types

---

**For detailed implementation notes, see:** `IMPLEMENTATION-SUMMARY.md`
**For testing procedures, see:** `TESTING-GUIDE.md`

