import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { REVIEW_MODULE } from "../../../modules/review"
import type ReviewModuleService from "../../../modules/review/service"
import { createReviewWorkflow } from "../../../workflows/review/create-review"

const createSchema = z.object({
  product_id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  author_name: z.string().min(1).max(120),
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(5000),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const productId = req.query.product_id as string | undefined
  if (!productId) {
    res.status(400).json({ message: "product_id is required" })
    return
  }

  const service = req.scope.resolve<ReviewModuleService>(REVIEW_MODULE)
  const reviews = await service.listReviews(
    { product_id: productId, status: "approved" },
    { order: { created_at: "DESC" } }
  )

  const count = reviews.length
  const avg =
    count > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / count) * 10
        ) / 10
      : null

  res.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      author_name: r.author_name,
      rating: r.rating,
      title: r.title,
      content: r.content,
      created_at: r.created_at,
    })),
    count,
    rating_average: avg,
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parse = createSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({
      message: "Invalid review payload",
      issues: parse.error.issues.map((i) => i.message),
    })
    return
  }

  // Verify the product exists and is published to avoid orphan reviews.
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id"],
    filters: { id: parse.data.product_id, status: "published" },
  })
  if (!products?.length) {
    res.status(404).json({ message: "Product not found" })
    return
  }

  const authContext = (req as any).auth_context
  const customerId =
    authContext?.actor_type === "customer" ? authContext.actor_id : null

  const { result: review } = await createReviewWorkflow(req.scope).run({
    input: {
      product_id: parse.data.product_id,
      customer_id: customerId,
      author_name: parse.data.author_name,
      rating: parse.data.rating,
      title: parse.data.title ?? null,
      content: parse.data.content,
    },
  })

  res.status(201).json({ review: { id: review.id, status: review.status } })
}
