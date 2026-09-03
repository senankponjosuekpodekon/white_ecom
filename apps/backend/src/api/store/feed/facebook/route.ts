import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { type Product, renderCsv } from "../../../../utils/build-feed"

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

  renderCsv(res, products, header, "facebook.csv", (v) => [
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
