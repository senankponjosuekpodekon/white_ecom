import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getFeedProducts, renderCsv } from "../../../../utils/build-feed"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const products = await getFeedProducts(req)

  const header = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "additional_image_link",
    "brand",
    "google_product_category",
    "product_type",
    "shipping",
    "identifier_exists",
    "gtin",
    "mpn",
    "item_group_id",
    "color",
    "size",
    "age_group",
    "gender",
    "sale_price",
  ]

  await renderCsv(req, res, products, header, "facebook.csv", (v) => [
    v.id,
    v.title,
    v.description,
    v.availability,
    v.condition,
    v.price,
    v.link,
    v.image_link,
    v.additional_image_link,
    v.brand,
    v.google_product_category,
    v.product_type,
    v.shipping,
    v.identifier_exists,
    v.gtin,
    v.mpn,
    v.item_group_id,
    v.color,
    v.size,
    v.age_group,
    v.gender,
    v.sale_price,
  ])
}
