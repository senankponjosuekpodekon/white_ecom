import { MedusaService } from "@medusajs/framework/utils"
import ProductEmbedding from "./models/product-embedding"

class EmbeddingModuleService extends MedusaService({
  ProductEmbedding,
}) {}

export default EmbeddingModuleService
