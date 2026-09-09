import { MedusaResponse } from "@medusajs/framework/http"
import {
  type Product,
  type ProductVariant,
  escapeCsv,
  formatPrice,
  getAvailability,
  getCondition,
  getGoogleProductCategory,
  getIdentifier,
  getMetadataValue,
} from "./feed"
export * from "./feed"
import { loadClientConfig, loadClientContent } from "./client-config"

export type FeedValue = string | number | undefined | null

export function buildFeedValues(
  product: Product,
  variant: ProductVariant,
  siteUrl: string,
  defaultLanguage: string,
  brand: string,
  defaultGoogleProductCategory: string,
  shipping: string
): Record<string, FeedValue> | null {
  const price = variant.prices?.[0]
  if (!price) {
    return null
  }

  const title =
    variant.title && variant.title !== "Default"
      ? `${product.title} - ${variant.title}`
      : product.title
  const link = `${siteUrl}/${defaultLanguage}/products/${product.handle}`
  const imageLink = product.thumbnail ?? product.images?.[0]?.url ?? ""
  const additionalImageLink = product.images?.[1]?.url ?? ""
  const description = product.description ?? ""
  const availability = getAvailability(variant)
  const priceValue = formatPrice(price.amount)
  const currency = price.currency_code.toUpperCase()
  const identifier = getIdentifier(product, variant)
  const condition = getCondition(product, variant)

  const color = getMetadataValue(product, variant, ["color", "couleur"]) ?? ""
  const size = getMetadataValue(product, variant, ["size", "taille", "talla"]) ?? ""
  const ageGroup =
    getMetadataValue(product, variant, ["age_group", "ageGroup", "edad"]) ?? ""
  const gender =
    getMetadataValue(product, variant, ["gender", "sexe", "sexo"]) ?? ""

  return {
    id: variant.id,
    title,
    description,
    link,
    image_link: imageLink,
    additional_image_link: additionalImageLink,
    condition,
    availability,
    price: `${priceValue} ${currency}`,
    price_value: priceValue,
    currency,
    brand,
    product_type: product.categories?.[0]?.name ?? "",
    google_product_category: getGoogleProductCategory(
      product,
      defaultGoogleProductCategory
    ),
    shipping,
    identifier_exists: identifier.exists,
    gtin: identifier.gtin ?? "",
    mpn: identifier.mpn ?? "",
    item_group_id: product.id,
    color,
    size,
    age_group: ageGroup,
    gender,
    sale_price: "",
  }
}

export function renderCsv(
  res: MedusaResponse,
  products: Product[],
  header: string[],
  filename: string,
  mapRow: (values: Record<string, FeedValue>) => FeedValue[]
) {
  const rows: string[] = [header.join(",")]

  const fileConfig = loadClientConfig()
  const content = loadClientContent()
  const defaultLanguage =
    (fileConfig.defaultLanguage as string) ?? process.env.DEFAULT_LANGUAGE ?? "fr"
  const localeContent = content[defaultLanguage as "fr" | "en"] ?? content.fr

  const siteUrl =
    (fileConfig.siteUrl as string) ?? process.env.SITE_URL ?? "http://localhost:8080"
  const merchant = localeContent?.merchant ?? {}
  const defaultBrand =
    merchant.brand ??
    (fileConfig.name as string) ??
    process.env.STORE_NAME ??
    "White Shop"
  const defaultGoogleProductCategory = merchant.googleProductCategory ?? ""
  const shipping = merchant.shipping ?? ""

  for (const product of products) {
    const productBrand =
      (product.metadata?.brand as string | undefined) ?? defaultBrand
    for (const variant of product.variants ?? []) {
      const values = buildFeedValues(
        product,
        variant,
        siteUrl,
        defaultLanguage,
        productBrand,
        defaultGoogleProductCategory,
        shipping
      )
      if (!values) continue
      rows.push(
        mapRow(values)
          .map((v) => escapeCsv(String(v ?? "")))
          .join(",")
      )
    }
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8")
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
  res.send(rows.join("\n"))
}
