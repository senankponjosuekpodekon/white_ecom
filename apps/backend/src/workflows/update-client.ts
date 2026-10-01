import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CLIENT_MODULE } from "../modules/client"
import type ClientModuleService from "../modules/client/service"

type UpdateClientInput = {
  id: string
  name?: string
  contact_email?: string | null
  domains?: string[]
  status?: string
  config?: Record<string, unknown>
  content?: Record<string, unknown>
  error?: string | null
}

const updateClientRecordStep = createStep(
  "update-client-record",
  async (input: UpdateClientInput, { container }) => {
    const service = container.resolve<ClientModuleService>(CLIENT_MODULE)
    await service.updateClients({
      id: input.id,
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.contact_email !== undefined
        ? { contact_email: input.contact_email }
        : {}),
      ...(input.domains !== undefined ? { domains: input.domains } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.config !== undefined ? { config: input.config } : {}),
      ...(input.content !== undefined ? { content: input.content } : {}),
      ...(input.error !== undefined ? { error: input.error } : {}),
    })
    return new StepResponse({ id: input.id })
  }
)

export const updateClientWorkflow = createWorkflow(
  "update-client",
  (input: UpdateClientInput) => {
    const result = updateClientRecordStep(input)
    return new WorkflowResponse(result)
  }
)
