import crypto from "crypto"
import { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { embedText } from "./embeddings"
import { EMBEDDING_MODULE } from "../modules/embedding"
import type EmbeddingModuleService from "../modules/embedding/service"

const textFor = (product: {
  title?: string
  description?: string | null
  handle?: string
  categories?: Array<{ name?: string }>
}) =>
  [
    product.title,
    product.description,
    product.handle,
    ...(product.categories ?? []).map((c) => c.name),
  ]
    .filter(Boolean)
    .join(" ")

export async function embedProduct(
  scope: MedusaContainer,
  product: {
    id: string
    title?: string
    description?: string | null
    handle?: string
    categories?: Array<{ name?: string }>
  }
): Promise<boolean> {
  const service = scope.resolve<EmbeddingModuleService>(EMBEDDING_MODULE)
  const text = textFor(product)
  if (!text.trim()) return false

  const hash = crypto.createHash("sha256").update(text).digest("hex")
  const existing = await service.listProductEmbeddings(
    { product_id: product.id },
    { take: 1 }
  )
  if (existing[0]?.text_hash === hash) return false

  const embedding = await embedText(text)
  if (!embedding.length) return false

  if (existing[0]) {
    await service.updateProductEmbeddings({
      id: existing[0].id,
      embedding,
      text_hash: hash,
    })
  } else {
    await service.createProductEmbeddings({
      product_id: product.id,
      embedding,
      text_hash: hash,
    })
  }
  return true
}

export async function reindexAllProducts(
  scope: MedusaContainer,
  limit = 500
): Promise<{ indexed: number; skipped: number; errors: number }> {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "description", "handle", "categories.name"],
    filters: { status: "published" },
    pagination: { skip: 0, take: limit },
  })

  let indexed = 0
  let skipped = 0
  let errors = 0
  for (const product of products) {
    try {
      const done = await embedProduct(scope, product)
      done ? indexed++ : skipped++
    } catch {
      errors++
    }
  }
  return { indexed, skipped, errors }
}
