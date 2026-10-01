import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CLIENT_MODULE } from "../modules/client"
import type ClientModuleService from "../modules/client/service"
import type { ClientRecord } from "../utils/client-resolver"
import {
  createVercelProject,
  deleteVercelProject,
  getVercelProject,
  triggerVercelDeploy,
  upsertVercelEnv,
  vercelConfigured,
} from "../utils/vercel"

type ProvisionInput = {
  slug: string
  name?: string
  contactEmail?: string
  domains?: string[]
  config?: Record<string, unknown>
  content?: Record<string, unknown>
}

function clientService(container: {
  resolve: <T>(key: string) => T
}): ClientModuleService {
  return container.resolve<ClientModuleService>(CLIENT_MODULE)
}

const upsertClientStep = createStep(
  "upsert-client",
  async (input: ProvisionInput, { container }) => {
    const service = clientService(container)
    const existing = (await service.listClients(
      { slug: input.slug },
      {}
    )) as unknown as ClientRecord[]

    if (existing.length) {
      const current = existing[0]
      await service.updateClients({
        id: current.id,
        name: input.name ?? current.name,
        contact_email: input.contactEmail ?? current.contact_email,
        domains: input.domains ?? current.domains,
        status: "provisioning",
        error: null,
      })
      return new StepResponse(
        { id: current.id, slug: current.slug, created: false },
        { id: current.id, created: false, previousStatus: current.status }
      )
    }

    const created = (await service.createClients({
      slug: input.slug,
      name: input.name ?? input.slug,
      contact_email: input.contactEmail ?? null,
      domains: input.domains ?? [],
      config: input.config ?? {},
      content: input.content ?? {},
      status: "provisioning",
    })) as unknown as ClientRecord

    return new StepResponse(
      { id: created.id, slug: created.slug, created: true },
      { id: created.id, created: true, previousStatus: "pending" }
    )
  },
  async (prev, { container }) => {
    if (!prev) return
    const service = clientService(container)
    if (prev.created) {
      await service.deleteClients(prev.id)
    } else {
      await service.updateClients({
        id: prev.id,
        status: prev.previousStatus,
      })
    }
  }
)

const createSalesChannelStep = createStep(
  "create-sales-channel",
  async (input: { clientId: string; slug: string }, { container }) => {
    const service = clientService(container)
    const clients = (await service.listClients(
      { id: input.clientId },
      {}
    )) as unknown as ClientRecord[]
    const existing = clients[0]?.sales_channel_id
    if (existing) {
      return new StepResponse({ id: existing, created: false })
    }

    const salesChannelModule = container.resolve(Modules.SALES_CHANNEL) as {
      createSalesChannels: (
        data: { name: string; description?: string }[]
      ) => Promise<{ id: string }[]>
      deleteSalesChannels: (ids: string[]) => Promise<void>
    }
    const [channel] = await salesChannelModule.createSalesChannels([
      { name: input.slug, description: `Sales channel for client ${input.slug}` },
    ])
    return new StepResponse({ id: channel.id, created: true })
  },
  async (prev, { container }) => {
    if (!prev?.created || !prev.id) return
    const salesChannelModule = container.resolve(Modules.SALES_CHANNEL) as {
      deleteSalesChannels: (ids: string[]) => Promise<void>
    }
    await salesChannelModule.deleteSalesChannels([prev.id])
  }
)

const createPublishableKeyStep = createStep(
  "create-publishable-key",
  async (input: { clientId: string; slug: string }, { container }) => {
    const service = clientService(container)
    const clients = (await service.listClients(
      { id: input.clientId },
      {}
    )) as unknown as ClientRecord[]
    const existing = clients[0]
    if (existing?.publishable_key && existing.publishable_key_id) {
      return new StepResponse({
        id: existing.publishable_key_id,
        token: existing.publishable_key,
        created: false,
      })
    }

    const apiKeyModule = container.resolve(Modules.API_KEY) as {
      createApiKeys: (
        data: { title: string; type: string; created_by: string }[]
      ) => Promise<{ id: string; token: string }[]>
      deleteApiKeys: (ids: string[]) => Promise<void>
    }
    const [key] = await apiKeyModule.createApiKeys([
      {
        title: `storefront-${input.slug}`,
        type: "publishable",
        created_by: "provisioning",
      },
    ])
    return new StepResponse({ id: key.id, token: key.token, created: true })
  },
  async (prev, { container }) => {
    if (!prev?.created || !prev.id) return
    const apiKeyModule = container.resolve(Modules.API_KEY) as {
      deleteApiKeys: (ids: string[]) => Promise<void>
    }
    await apiKeyModule.deleteApiKeys([prev.id])
  }
)

const linkKeyToChannelStep = createStep(
  "link-key-to-channel",
  async (input: { keyId: string; channelId: string }, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK) as {
      create: (data: unknown) => Promise<unknown>
      dismiss: (data: unknown) => Promise<unknown>
    }
    const link = {
      [Modules.API_KEY]: { publishable_key_id: input.keyId },
      [Modules.SALES_CHANNEL]: { sales_channel_id: input.channelId },
    }
    await remoteLink.create(link)
    return new StepResponse(link)
  },
  async (prev, { container }) => {
    if (!prev) return
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK) as {
      dismiss: (data: unknown) => Promise<unknown>
    }
    await remoteLink.dismiss(prev)
  }
)

const provisionVercelStep = createStep(
  "provision-vercel",
  async (input: { slug: string; publishableKey: string }) => {
    if (!vercelConfigured()) {
      return new StepResponse({
        storefrontUrl: null as string | null,
        created: false,
        projectName: null as string | null,
      })
    }

    const projectName = `shop-${input.slug}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .slice(0, 52)
    const backendUrl =
      process.env.PLATFORM_BACKEND_URL ??
      process.env.MEDUSA_BACKEND_URL ??
      "http://localhost:9000"

    let project
    try {
      project = await getVercelProject(projectName)
    } catch {
      project = await createVercelProject(projectName)
    }

    await upsertVercelEnv(
      project.id,
      "NEXT_PUBLIC_MEDUSA_BACKEND_URL",
      backendUrl
    )
    await upsertVercelEnv(
      project.id,
      "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY",
      input.publishableKey
    )
    const deployment = await triggerVercelDeploy(project)
    const storefrontUrl = deployment.url
      ? `https://${deployment.url}`
      : `https://${project.name}.vercel.app`

    return new StepResponse({
      storefrontUrl,
      created: true,
      projectName: project.name,
    })
  },
  async (prev) => {
    if (!prev?.created || !prev.projectName) return
    await deleteVercelProject(prev.projectName).catch(() => undefined)
  }
)

const activateClientStep = createStep(
  "activate-client",
  async (
    input: {
      clientId: string
      channelId: string
      keyId: string
      publishableKey: string
      storefrontUrl: string | null
    },
    { container }
  ) => {
    const service = clientService(container)
    await service.updateClients({
      id: input.clientId,
      status: "active",
      sales_channel_id: input.channelId,
      publishable_key_id: input.keyId,
      publishable_key: input.publishableKey,
      storefront_url: input.storefrontUrl,
      error: null,
    })
    return new StepResponse({ id: input.clientId })
  }
)

export const provisionClientWorkflow = createWorkflow(
  "provision-client",
  (input: ProvisionInput) => {
    const upserted = upsertClientStep(input)

    const channelInput = transform({ upserted }, ({ upserted }) => ({
      clientId: upserted.id,
      slug: upserted.slug,
    }))
    const channel = createSalesChannelStep(channelInput)
    const key = createPublishableKeyStep(channelInput)
    linkKeyToChannelStep(
      transform({ key, channel }, ({ key, channel }) => ({
        keyId: key.id,
        channelId: channel.id,
      }))
    )
    const vercel = provisionVercelStep(
      transform({ upserted, key }, ({ upserted, key }) => ({
        slug: upserted.slug,
        publishableKey: key.token,
      }))
    )
    const activated = activateClientStep(
      transform(
        { upserted, channel, key, vercel },
        ({ upserted, channel, key, vercel }) => ({
          clientId: upserted.id,
          channelId: channel.id,
          keyId: key.id,
          publishableKey: key.token,
          storefrontUrl: vercel.storefrontUrl,
        })
      )
    )

    return new WorkflowResponse(activated)
  }
)
