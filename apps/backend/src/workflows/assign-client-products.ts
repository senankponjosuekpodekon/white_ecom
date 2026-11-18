import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CLIENT_MODULE } from "../modules/client"
import type ClientModuleService from "../modules/client/service"
import type { ClientRecord } from "../utils/client-resolver"

type AssignInput = {
  clientId: string
  productIds: string[]
}

// Links a batch of products to a tenant's sales channel so they become
// visible on that tenant's storefront (its publishable key is linked to the
// channel). Already-linked products are skipped.
const assignProductsStep = createStep(
  "assign-products",
  async (input: AssignInput, { container }) => {
    const service = container.resolve<ClientModuleService>(CLIENT_MODULE)
    const clients = (await service.listClients(
      { id: input.clientId },
      {}
    )) as unknown as ClientRecord[]
    const client = clients[0]
    if (!client) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Client not found")
    }
    if (!client.sales_channel_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Client ${client.slug} has no sales channel`
      )
    }

    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK) as {
      create: (data: unknown) => Promise<unknown>
      dismiss: (data: unknown) => Promise<unknown>
    }

    const channelId = client.sales_channel_id
    const linked: { product_id: string; sales_channel_id: string }[] = []
    const skipped: string[] = []

    for (const productId of input.productIds) {
      const link = {
        [Modules.PRODUCT]: { product_id: productId },
        [Modules.SALES_CHANNEL]: { sales_channel_id: channelId },
      }
      try {
        await remoteLink.create(link)
        linked.push({ product_id: productId, sales_channel_id: channelId })
      } catch {
        skipped.push(productId)
      }
    }

    return new StepResponse({ linked, skipped, channelId }, linked)
  },
  async (linked, { container }) => {
    if (!linked?.length) return
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK) as {
      dismiss: (data: unknown) => Promise<unknown>
    }
    for (const l of linked) {
      await remoteLink
        .dismiss({
          [Modules.PRODUCT]: { product_id: l.product_id },
          [Modules.SALES_CHANNEL]: { sales_channel_id: l.sales_channel_id },
        })
        .catch(() => undefined)
    }
  }
)

export const assignClientProductsWorkflow = createWorkflow(
  "assign-client-products",
  (input: AssignInput) => {
    const result = assignProductsStep(input)
    return new WorkflowResponse(result)
  }
)
