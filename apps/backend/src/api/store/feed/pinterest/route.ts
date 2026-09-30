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
    "additional_image_link",
    "price",
    "currency",
    "availability",
    "condition",
    "brand",
    "google_product_category",
    "product_type",
    "gtin",
    "mpn",
    "item_group_id",
    "color",
    "size",
    "age_group",
    "gender",
  ]

  renderCsv(res, products, header, "pinterest.csv", (v) => [
    v.id,
    v.title,
    v.description,
    v.link,
    v.image_link,
    v.additional_image_link,
    v.price_value,
    v.currency,
    v.availability,
    v.condition,
    v.brand,
    v.google_product_category,
    v.product_type,
    v.gtin,
    v.mpn,
    v.item_group_id,
    v.color,
    v.size,
    v.age_group,
    v.gender,
  ])
}
