# Testing Guide - Strapi Schema Implementation

## Quick Start

### 1. Restart Strapi Server

```bash
# Development mode
npm run develop

# Production mode
npm run build
npm run start
```

### 2. Verify Schema Loading

Watch terminal output for:
```
✔ Building build context (XX ms)
✔ Creating API (XX ms)
```

Look for new content types:
- shipping-box
- cold-chain-settings
- region
- tag
- testimonial
- wishlist

---

## Admin UI Testing

### Access Admin Panel
1. Navigate to: `http://localhost:1337/admin`
2. Login with admin credentials
3. Navigate to **Content Manager**

### Test Each Content Type

#### ✅ ProductCollection (Modified)
**Path:** Content Manager → Collection Types → ProductCollection

**Test:**
1. Edit existing collection or create new
2. Verify new fields visible:
   - Description (text field)
   - Long Description (rich text blocks)
   - Hero Image (media upload)
   - Hero Image Alt (text field)
3. Save and publish

---

#### ✅ Home Hero (Modified)
**Path:** Content Manager → Single Types → Home

**Test:**
1. Find Hero component section
2. Verify new fields:
   - Subtitle (text field)
   - Background Image Alt (required text)
3. Save

---

#### ✅ Header (Modified)
**Path:** Content Manager → Single Types → Header

**Test:**
1. Verify new fields:
   - Phone Number
   - Phone Label (default: "Call us:")
2. Add test phone: "(555) 123-4567"
3. Save and publish

---

#### ✅ ShippingSetting (Modified)
**Path:** Content Manager → Single Types → Shipping Setting

**Test:**
1. Verify new fields:
   - UPS Account Number (sensitive field)
   - Enable Real Time Rates (toggle)
   - Default Origin Zip
   - Rate Fallback Amount
2. Enter test data
3. Save and publish

---

#### ✅ ShippingBox (New Collection)
**Path:** Content Manager → Collection Types → ShippingBox

**Test Entry:**
```
Name: Small Box
Length: 12
Width: 8
Height: 6
Max Weight: 20
Tare Weight: 0.5
Active: true
```

---

#### ✅ ColdChainSettings (New Single Type)
**Path:** Content Manager → Single Types → Cold Chain Settings

**Test Entry:**
```
Dry Ice Price Per Lb: 2.50
Minimum Dry Ice Amount: 5
Temperature Threshold: 32
Cold Chain Surcharge: 15.00
Enabled: true

Transit Day Thresholds:
  - Transit Days: 1, Dry Ice Multiplier: 1.0
  - Transit Days: 2, Dry Ice Multiplier: 1.5
  - Transit Days: 3, Dry Ice Multiplier: 2.0
```

---

#### ✅ Region (New Collection)
**Path:** Content Manager → Collection Types → Region

**Test Entry:**
```
Region Code: us
Region Name: United States
Currency Code: USD
Locale: en-US
Active: true
Is Default: true
```

---

#### ✅ Tag (New Collection)
**Path:** Content Manager → Collection Types → Tag

**Test Entries:**
```
1. Name: Beef, Slug: beef, Color: #8B4513, Is Active: true
2. Name: Fast Shipping, Slug: fast-shipping, Color: #4CAF50, Is Active: true
3. Name: Quality, Slug: quality, Color: #2196F3, Is Active: true
```

---

#### ✅ Testimonial (New Collection)
**Path:** Content Manager → Collection Types → Testimonial

**Test Entry:**
```
Customer Name: John Smith
Customer Title: Executive Chef
Customer Company: The Steakhouse NYC
Customer Location: New York, NY
Testimonial Text: "Best quality beef we've ever ordered!"
Featured Quote: "Best quality beef"
Rating: 5
Date Received: 2025-12-01
Display Order: 1
Is Active: true
Tags: [Beef, Quality]
Categories: Product Quality
```

---

#### ✅ Wishlist (New Collection)
**Path:** Content Manager → Collection Types → Wishlist

**Test Entry:**
```
Medusa Customer Id: cus_test123
Products: [Select test products]
Recipes: [Select test recipes]
```

---

## GraphQL Testing

### Access GraphQL Playground
Navigate to: `http://localhost:1337/graphql`

### Test Queries

#### ProductCollection Query
```graphql
query {
  productCollections {
    data {
      attributes {
        Name
        Description
        LongDescription
        HeroImage {
          data {
            attributes {
              url
            }
          }
        }
        HeroImageAlt
      }
    }
  }
}
```

#### Header Query
```graphql
query {
  header {
    data {
      attributes {
        PhoneNumber
        PhoneLabel
        HeaderNav {
          Text
          Url
        }
      }
    }
  }
}
```

#### Testimonials Query
```graphql
query {
  testimonials {
    data {
      attributes {
        CustomerName
        FeaturedQuote
        Rating
        Tags {
          data {
            attributes {
              Name
              Slug
            }
          }
        }
      }
    }
  }
}
```

#### ShippingBoxes Query
```graphql
query {
  shippingBoxes {
    data {
      attributes {
        Name
        Length
        Width
        Height
        Active
      }
    }
  }
}
```

---

## Component Testing

### Shared Components

Test components are available in other content types:

#### Certification Component
**Usage:** Add to Footer or other single types via dynamic zones

**Test:**
```
Name: Kosher Certified
Badge Image: [Upload certification image]
Alt Text: Kosher Certification Badge
Link Url: https://www.kosher.com
```

#### Social Links Component
**Usage:** Add to Footer or Global settings

**Test:**
```
Instagram: https://instagram.com/grillerspride
Facebook: https://facebook.com/grillerspride
Pinterest: https://pinterest.com/grillerspride
```

#### Payment Methods Component
**Usage:** Add to Footer

**Test:**
All toggles: true (displays all payment icons)

#### Testimonial Section Component
**Usage:** Add to Home or other page dynamic zones

**Test:**
```
Title: What Our Customers Say
Subtitle: Real reviews from real customers
Display Style: carousel
Items To Show: 3
Show Ratings: true
Show Photos: true
Filter By Tags: [Beef, Quality]
Sort Order: date-desc
```

---

## Common Issues & Solutions

### Issue: Content Type Not Appearing

**Solution:**
1. Stop Strapi server
2. Clear cache: `rm -rf .cache build`
3. Rebuild: `npm run build`
4. Restart: `npm run develop`

---

### Issue: GraphQL Query Returns Null

**Checklist:**
- [ ] Content is published (not draft)
- [ ] Permissions enabled in Settings → Users & Permissions Plugin → Roles → Public
- [ ] Field is not private
- [ ] Relation targets exist and are published

---

### Issue: Schema Validation Error

**Check:**
1. Valid JSON syntax in schema.json files
2. Component references use correct naming (e.g., "shared.seo")
3. No duplicate attribute names
4. Correct relation syntax

---

## Permissions Configuration

### Enable Public Access (for frontend)

**Path:** Settings → Users & Permissions Plugin → Roles → Public

Enable for each content type:
- [x] find (read all)
- [x] findOne (read single)

For authenticated users:
- [x] create (Wishlist only)
- [x] update (Wishlist only)
- [x] delete (Wishlist only)

---

## Database Verification

### Check SQLite Database (Development)

```bash
sqlite3 .tmp/data.db

# List tables
.tables

# Check structure
.schema shipping_boxes
.schema testimonials
.schema tags

# Exit
.quit
```

---

## Success Criteria

✅ **All tests pass when:**

1. All 16 new/modified content types appear in Admin UI
2. Sample content can be created and saved
3. GraphQL queries return expected data structure
4. Components render in dynamic zones
5. Relations work bidirectionally (Tag ↔ Testimonial)
6. No console errors in browser or terminal
7. Published content accessible via API

---

## Next Steps After Testing

1. ✅ Verify all schemas load correctly
2. ✅ Create seed data for development
3. ✅ Configure production database connection
4. ✅ Update frontend GraphQL queries
5. ✅ Implement testimonial frontend components
6. ✅ Test Medusa customer ID integration for Wishlist

---

## Rollback Procedure

If issues occur:

```bash
# Backup current state
cp -r src/api src/api.backup
cp -r src/components src/components.backup

# Restore from git
git checkout src/api
git checkout src/components

# Restart
npm run develop
```

---

## Support Resources

- **Strapi Documentation:** https://docs.strapi.io/
- **GraphQL Playground:** http://localhost:1337/graphql
- **Admin Panel:** http://localhost:1337/admin
- **API Docs:** http://localhost:1337/documentation (if plugin enabled)

---

**Happy Testing!** 🧪




