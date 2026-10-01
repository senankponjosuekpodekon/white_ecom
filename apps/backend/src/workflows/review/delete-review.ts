import { createStep, StepResponse, createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { REVIEW_MODULE } from "../../modules/review"
import type ReviewModuleService from "../../modules/review/service"

const deleteReviewStep = createStep(
  "delete-review",
  async (input: { id: string }, { container }) => {
    const service = container.resolve<ReviewModuleService>(REVIEW_MODULE)
    const previous = await service.retrieveReview(input.id)
    await service.deleteReviews(input.id)
    return new StepResponse(input.id, previous)
  },
  async (previous: ({ id: string } & Record<string, unknown>) | undefined, { container }) => {
    if (!previous?.id) return
    const service = container.resolve<ReviewModuleService>(REVIEW_MODULE)
    await service.createReviews(previous)
  }
)

export const deleteReviewWorkflow = createWorkflow(
  "delete-review",
  (input: { id: string }) => {
    const result = deleteReviewStep(input)
    return new WorkflowResponse(result)
  }
)
