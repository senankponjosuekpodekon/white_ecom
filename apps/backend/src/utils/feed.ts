export type ProductVariant = {
  id: string
  title: string
  sku?: string | null
  prices?: Array<{ amount: number; currency_code: string }>
  inventory_quantity?: number
  manage_inventory?: boolean
  allow_backorder?: boolean
  metadata?: Record<string, unknown>
}

export type ProductImage = { url: string }

export type ProductCategory = { name: string }

export type Product = {
  id: string
  title: string
  handle: string
  description?: string | null
  thumbnail?: string | null
  metadata?: Record<string, unknown>
  variants: ProductVariant[]
  images?: ProductImage[]
  categories?: ProductCategory[]
}

export function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function formatPrice(amount: number): string {
  return (amount / 100).toFixed(2)
}

export function getAvailability(variant: ProductVariant): string {
  if (variant.allow_backorder) return "preorder"
  if (variant.manage_inventory === false) return "in stock"
  if (
    variant.inventory_quantity === null ||
    variant.inventory_quantity === undefined
  ) {
    return "in stock"
  }
  if (variant.inventory_quantity > 0) return "in stock"
  return "out of stock"
}

export function getMetadataValue(
  product: Product,
  variant: ProductVariant,
  keys: string[]
): string | undefined {
  for (const key of keys) {
    const vValue = variant.metadata?.[key]
    if (vValue !== undefined && vValue !== null && vValue !== "") {
      return String(vValue)
    }
    const pValue = product.metadata?.[key]
    if (pValue !== undefined && pValue !== null && pValue !== "") {
      return String(pValue)
    }
  }
  return undefined
}

export function getCondition(product: Product, variant: ProductVariant): string {
  const condition = getMetadataValue(product, variant, ["condition"])
  if (condition === "new" || condition === "refurbished" || condition === "used") {
    return condition
  }
  return "new"
}

export function getIdentifier(
  product: Product,
  variant: ProductVariant
): { exists: string; gtin?: string; mpn?: string } {
  const gtin =
    (variant.metadata?.gtin as string) ??
    (product.metadata?.gtin as string) ??
    undefined
  const mpn =
    (variant.metadata?.mpn as string) ??
    (product.metadata?.mpn as string) ??
    (variant.sku as string) ??
    undefined

  if (gtin || mpn) {
    return { exists: "yes", gtin, mpn }
  }
  return { exists: "no" }
}

export function getGoogleProductCategory(
  product: Product,
  defaultCategory: string
): string {
  const fromMetadata =
    (product.metadata?.google_product_category as string) ??
    (product.metadata?.googleProductCategory as string) ??
    undefined
  return (
    fromMetadata ??
    product.categories?.[0]?.name ??
    defaultCategory ??
    ""
  )
}
