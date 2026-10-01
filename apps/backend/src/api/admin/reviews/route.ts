import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { REVIEW_MODULE } from "../../../modules/review"
import type ReviewModuleService from "../../../modules/review/service"
import { requireUser } from "../utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) return

  const status = req.query.status as string | undefined
  const filters: Record<string, unknown> = {}
  if (status === "pending" || status === "approved" || status === "rejected") {
    filters.status = status
  }

  const service = req.scope.resolve<ReviewModuleService>(REVIEW_MODULE)
  const reviews = await service.listReviews(filters, {
    order: { created_at: "DESC" },
    take: 200,
  })

  res.json({ reviews })
}
