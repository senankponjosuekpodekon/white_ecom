import { createStep, StepResponse, createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { REVIEW_MODULE } from "../../modules/review"
import type ReviewModuleService from "../../modules/review/service"

type UpdateReviewStatusInput = {
  id: string
  status: "pending" | "approved" | "rejected"
}

const updateReviewStatusStep = createStep(
  "update-review-status",
  async (input: UpdateReviewStatusInput, { container }) => {
    const service = container.resolve<ReviewModuleService>(REVIEW_MODULE)
    const previous = await service.retrieveReview(input.id)
    const review = await service.updateReviews(input)
    return new StepResponse(review, {
      id: input.id,
      status: previous.status,
    })
  },
  async (compensation: { id: string; status: string } | undefined, { container }) => {
    if (!compensation?.id) return
    const service = container.resolve<ReviewModuleService>(REVIEW_MODULE)
    await service.updateReviews({
      id: compensation.id,
      status: compensation.status,
    })
  }
)

export const updateReviewStatusWorkflow = createWorkflow(
  "update-review-status",
  (input: UpdateReviewStatusInput) => {
    const review = updateReviewStatusStep(input)
    return new WorkflowResponse(review)
  }
)
