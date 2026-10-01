import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { updateReviewStatusWorkflow } from "../../../../workflows/review/update-review-status"
import { deleteReviewWorkflow } from "../../../../workflows/review/delete-review"
import { requireUser } from "../../utils"

const updateSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) return

  const parse = updateSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "status must be pending|approved|rejected" })
    return
  }

  const { result: review } = await updateReviewStatusWorkflow(req.scope).run({
    input: { id: req.params.id, status: parse.data.status },
  })

  res.json({ review })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) return

  await deleteReviewWorkflow(req.scope).run({
    input: { id: req.params.id },
  })
  res.status(200).json({ deleted: true })
}
