import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { loadClientConfig, loadClientContent } from "../../../../utils/client-config"

type ProductVariant = {
  id: string
  title: string
  sku?: string | null
  prices?: Array<{ amount: number; currency_code: string }>
  inventory_quantity?: number
  manage_inventory?: boolean
  allow_backorder?: boolean
  metadata?: Record<string, unknown>
}

type ProductImage = { url: string }

type ProductCategory = { name: string }

type Product = {
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

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatPrice(amount: number): string {
  return (amount / 100).toFixed(2)
}

function getAvailability(variant: ProductVariant): string {
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

function getIdentifier(
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

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as {
    graph: <T>(config: {
      entity: string
      fields: string[]
      take?: number
      skip?: number
    }) => Promise<{ data: T[] }>
  }

  const { data: products } = await query.graph<Product>({
    entity: "product",
    fields: [
      "*",
      "variants.*",
      "variants.prices.*",
      "variants.inventory_quantity",
      "variants.manage_inventory",
      "variants.allow_backorder",
      "images.url",
      "categories.name",
    ],
    take: 1000,
  })

  const fileConfig = loadClientConfig()
  const content = loadClientContent()
  const defaultLanguage =
    (fileConfig.defaultLanguage as string) ?? process.env.DEFAULT_LANGUAGE ?? "fr"
  const localeContent = content[defaultLanguage as "fr" | "en"] ?? content.fr

  const siteUrl = localeContent?.siteUrl ?? process.env.SITE_URL ?? "http://localhost:8080"
  const merchant = localeContent?.merchant ?? {}
  const brand = merchant.brand ?? (fileConfig.name as string) ?? process.env.STORE_NAME ?? "White Shop"
  const googleProductCategory = merchant.googleProductCategory ?? ""
  const shipping = merchant.shipping ?? ""
  const baseIdentifierExists = merchant.identifierExists ?? "no"

  const header = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "condition",
    "availability",
    "price",
    "currency",
    "brand",
    "product_type",
    "google_product_category",
    "shipping",
    "identifier_exists",
    "gtin",
    "mpn",
    "item_group_id",
  ]

  const rows: string[] = [header.join(",")]

  for (const product of products) {
    const productType =
      product.categories?.[0]?.name ?? googleProductCategory ?? ""

    for (const variant of product.variants ?? []) {
      const price = variant.prices?.[0]
      if (!price) continue

      const title =
        variant.title && variant.title !== "Default"
          ? `${product.title} - ${variant.title}`
          : product.title
      const link = `${siteUrl}/${defaultLanguage}/products/${product.handle}`
      const imageLink = product.thumbnail ?? product.images?.[0]?.url ?? ""
      const description = product.description ?? ""
      const availability = getAvailability(variant)
      const priceValue = formatPrice(price.amount)
      const currency = price.currency_code.toUpperCase()
      const identifier = getIdentifier(product, variant)
      const identifierExists = identifier.exists

      const values = [
        variant.id,
        title,
        description,
        link,
        imageLink,
        "new",
        availability,
        priceValue,
        currency,
        brand,
        productType,
        googleProductCategory,
        shipping,
        identifierExists,
        identifier.gtin ?? "",
        identifier.mpn ?? "",
        product.id,
      ].map((v) => escapeCsv(String(v ?? "")))

      rows.push(values.join(","))
    }
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8")
  res.setHeader("Content-Disposition", 'attachment; filename="google.csv"')
  res.send(rows.join("\n"))
}
