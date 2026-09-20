/** Shared public-catalog contract; keep retail OOS separate from internal use. */
const internalLifecycle = (record: any) =>
  ["availability_lifecycle", "availabilityLifecycle", "AvailabilityLifecycle"].some(key =>
    String(record?.[key] ?? "").trim().toLowerCase() === "internal_only")

export function isInternalProduct(record: any): boolean {
  const product = record?.MedusaProduct
  return internalLifecycle(product) || Boolean(product?.Variants?.some((variant: any) =>
    /^RM-/i.test(String(variant?.Sku ?? "").trim()) || internalLifecycle(variant)))
}

export function shouldExcludeFromSearch(record: any): boolean {
  const product = record?.MedusaProduct
  if (!product || !(product.ProductId || product.Id)) return true
  if (product.Status != null && product.Status !== "published") return true
  if (isInternalProduct(record)) return true
  // Retain the existing seasonal search rule until #323's reviewed lifecycle
  // publication replaces it. A Z prefix is not an internal/accounting identity.
  return Boolean(product.Variants?.some((variant: any) =>
    /^Z-/i.test(String(variant?.Sku ?? "").trim())))
}
