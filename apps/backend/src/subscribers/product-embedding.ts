import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { embedProduct } from "../utils/reindex-embeddings"
import { embeddingProvider } from "../utils/embeddings"

export default async function productEmbeddingHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  if (!embeddingProvider()) return

  const query = container.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "description", "handle", "categories.name"],
    filters: { id: data.id },
  })
  const product = products?.[0]
  if (!product || product.status === "draft") return

  try {
    await embedProduct(container, product)
  } catch (err) {
    console.warn(`[embedding] failed for product ${data.id}:`, err)
  }
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
}
