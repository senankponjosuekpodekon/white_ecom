import { MedusaError } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CLIENT_MODULE } from "../modules/client"
import type ClientModuleService from "../modules/client/service"
import type { ClientRecord } from "../utils/client-resolver"

type ClientRequestInput = {
  slug: string
  name: string
  contactEmail?: string
  domains?: string[]
}

const createClientRequestStep = createStep(
  "create-client-request",
  async (input: ClientRequestInput, { container }) => {
    const service = container.resolve<ClientModuleService>(CLIENT_MODULE)
    const existing = (await service.listClients(
      { slug: input.slug },
      {}
    )) as unknown as ClientRecord[]
    if (existing.length) {
      throw new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        `Slug "${input.slug}" is already taken`
      )
    }
    const created = (await service.createClients({
      slug: input.slug,
      name: input.name,
      contact_email: input.contactEmail ?? null,
      domains: input.domains ?? [],
      status: "pending",
    })) as unknown as ClientRecord
    return new StepResponse({ id: created.id })
  }
)

export const createClientRequestWorkflow = createWorkflow(
  "create-client-request",
  (input: ClientRequestInput) => {
    const created = createClientRequestStep(input)
    return new WorkflowResponse(created)
  }
)
