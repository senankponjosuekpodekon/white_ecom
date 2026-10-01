import { model } from "@medusajs/framework/utils"

const ProductEmbedding = model.define("product_embedding", {
  id: model.id().primaryKey(),
  product_id: model.text().unique(),
  embedding: model.json(),
  text_hash: model.text().nullable(),
})

export default ProductEmbedding
