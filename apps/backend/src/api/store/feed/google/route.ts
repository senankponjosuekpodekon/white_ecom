import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getFeedProducts, renderCsv } from "../../../../utils/build-feed"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const products = await getFeedProducts(req)

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
    "color",
    "size",
    "age_group",
    "gender",
  ]

  renderCsv(res, products, header, "google.csv", (v) => [
    v.id,
    v.title,
    v.description,
    v.link,
    v.image_link,
    v.condition,
    v.availability,
    v.price_value,
    v.currency,
    v.brand,
    v.product_type,
    v.google_product_category,
    v.shipping,
    v.identifier_exists,
    v.gtin,
    v.mpn,
    v.item_group_id,
    v.color,
    v.size,
    v.age_group,
    v.gender,
  ])
}
