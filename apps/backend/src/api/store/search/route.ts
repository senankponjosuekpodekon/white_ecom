import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { embedText, cosineSimilarity, embeddingProvider } from "../../../utils/embeddings"
import { EMBEDDING_MODULE } from "../../../modules/embedding"
import type EmbeddingModuleService from "../../../modules/embedding/service"

const MIN_SCORE = 0.35

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const q = String(req.query.q ?? "").trim()
  if (!q) {
    res.status(400).json({ message: "q is required" })
    return
  }
  if (!embeddingProvider()) {
    res.status(200).json({ products: [], semantic: false })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const service = req.scope.resolve<EmbeddingModuleService>(EMBEDDING_MODULE)

  const queryVector = await embedText(q)
  if (!queryVector.length) {
    res.status(200).json({ products: [], semantic: false })
    return
  }

  const embeddings = await service.listProductEmbeddings({}, { take: 2000 })
  const ranked = embeddings
    .map((row) => ({
      product_id: row.product_id,
      score: cosineSimilarity(queryVector, row.embedding as number[]),
    }))
    .filter((row) => row.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)

  const ids = ranked.slice(0, 24).map((row) => row.product_id)
  if (!ids.length) {
    res.status(200).json({ products: [], semantic: true })
    return
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "description",
      "handle",
      "thumbnail",
      "status",
      "created_at",
      "categories.id",
      "variants.id",
      "variants.title",
      "variants.sku",
      "variants.manage_inventory",
    ],
    filters: { id: ids, status: "published" },
    pagination: { skip: 0, take: ids.length },
  }, { locale: req.locale })

  const order = new Map(ids.map((id, i) => [id, i]))
  const sorted = [...products].sort(
    (a: { id: string }, b: { id: string }) =>
      (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0)
  )

  res.status(200).json({ products: sorted, count: sorted.length, semantic: true })
}
