import test from "node:test"
import assert from "node:assert/strict"
import { isInternalProduct, shouldExcludeFromSearch } from "../src/utils/public-catalog.ts"

const product = (sku, productFields = {}, variantFields = {}) => ({
  MedusaProduct: { ProductId: "prod_test", Status: "published", ...productFields,
    Variants: [{ Sku: sku, ...variantFields }] },
})
test("case and whitespace cannot admit raw materials", () => {
  for (const sku of ["RM-01", " rm-01 ", "\trM-01\n"]) {
    assert.equal(isInternalProduct(product(sku)), true)
    assert.equal(shouldExcludeFromSearch(product(sku)), true)
  }
})
test("renaming an internal SKU and setting a child active cannot override its parent", () => {
  assert.equal(isInternalProduct(product("retail-name", { AvailabilityLifecycle: "internal_only" }, { AvailabilityLifecycle: "active" })), true)
  assert.equal(isInternalProduct(product("new-name", {}, { AvailabilityLifecycle: " INTERNAL_ONLY " })), true)
})
test("mixed products remain internal, with stable IDs untouched", () => {
  const p = product("retail", { QuickBooksListId: "parent-id" })
  p.MedusaProduct.Variants.push({ Sku: "RM-raw", QuickBooksListId: "variant-id" })
  const original = JSON.stringify(p)
  assert.equal(shouldExcludeFromSearch(p), true)
  assert.equal(JSON.stringify(p), original)
})
test("retail OOS stays public; internal classification is distinct from seasonal search", () => {
  assert.equal(shouldExcludeFromSearch(product("retail", {}, { inventory_quantity: 0 })), false)
  assert.equal(isInternalProduct(product("Z-retail")), false)
  assert.equal(shouldExcludeFromSearch(product("Z-retail")), true)
  assert.equal(shouldExcludeFromSearch(product("retail", { Status: "draft" })), true)
  assert.equal(shouldExcludeFromSearch({}), true)
})
