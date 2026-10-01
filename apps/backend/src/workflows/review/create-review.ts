import { createStep, StepResponse, createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { REVIEW_MODULE } from "../../modules/review"
import type ReviewModuleService from "../../modules/review/service"

type CreateReviewInput = {
  product_id: string
  customer_id?: string | null
  author_name: string
  rating: number
  title?: string | null
  content: string
}

const createReviewStep = createStep(
  "create-review",
  async (input: CreateReviewInput, { container }) => {
    const service = container.resolve<ReviewModuleService>(REVIEW_MODULE)
    const review = await service.createReviews({
      ...input,
      status: "pending",
    })
    return new StepResponse(review, review.id)
  },
  async (id: string | undefined, { container }) => {
    if (!id) return
    const service = container.resolve<ReviewModuleService>(REVIEW_MODULE)
    await service.deleteReviews(id)
  }
)

export const createReviewWorkflow = createWorkflow(
  "create-review",
  (input: CreateReviewInput) => {
    const review = createReviewStep(input)
    return new WorkflowResponse(review)
  }
)
