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

type CloneInput = {
  clientId: string
  productIds: string[]
}

type SourceVariant = {
  title?: string
  sku?: string | null
  barcode?: string | null
  prices?: { amount: number; currency_code: string }[]
  options?: { value?: string; option?: { title?: string } }[]
}

type SourceProduct = {
  id: string
  title: string
  handle: string
  subtitle?: string | null
  description?: string | null
  status?: string
  is_giftcard?: boolean
  discountable?: boolean
  thumbnail?: string | null
  images?: { url: string }[]
  categories?: { id: string }[]
  tags?: { id: string }[]
  collection_id?: string | null
  type_id?: string | null
  options?: { title: string; values?: (string | { value: string })[] }[]
  variants?: SourceVariant[]
}

// Clones master-catalog products into a tenant's sales channel. Each clone
// is an independent product the merchant can edit freely; `source_product_id`
// in metadata keeps the link to the master for possible later sync.
const cloneProductsStep = createStep(
  "clone-products",
  async (input: CloneInput, { container }) => {
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

    const productModule = container.resolve(Modules.PRODUCT) as unknown as {
      listProducts: (
        filters: Record<string, unknown>,
        config?: { relations?: string[] }
      ) => Promise<SourceProduct[]>
      createProducts: (
        data: Record<string, unknown>[]
      ) => Promise<{ id: string }[]>
      deleteProducts: (ids: string[]) => Promise<void>
    }

    const sources = await productModule.listProducts(
      { id: input.productIds },
      { relations: ["variants", "variants.prices", "images", "options", "categories", "tags"] }
    )

    const payload = sources.map((p) => ({
      title: p.title,
      handle: `${p.handle}-${client.slug}`,
      subtitle: p.subtitle ?? undefined,
      description: p.description ?? undefined,
      status: p.status ?? "published",
      is_giftcard: p.is_giftcard ?? false,
      discountable: p.discountable ?? true,
      thumbnail: p.thumbnail ?? undefined,
      images: (p.images ?? []).map((i) => ({ url: i.url })),
      categories: (p.categories ?? []).map((c) => ({ id: c.id })),
      tags: (p.tags ?? []).map((t) => ({ id: t.id })),
      collection_id: p.collection_id ?? undefined,
      type_id: p.type_id ?? undefined,
      options: (p.options ?? []).map((o) => ({
        title: o.title,
        values: (o.values ?? []).map((v) =>
          typeof v === "string" ? v : v.value
        ),
      })),
      variants: (p.variants ?? []).map((v) => ({
        title: v.title,
        sku: v.sku ?? undefined,
        barcode: v.barcode ?? undefined,
        prices: (v.prices ?? []).map((pr) => ({
          amount: pr.amount,
          currency_code: pr.currency_code,
        })),
        options: (v.options ?? []).map((vo) => ({
          value: vo.value,
        })),
      })),
      sales_channels: [{ id: client.sales_channel_id }],
      metadata: {
        source_product_id: p.id,
        source_slug: client.slug,
        cloned_at: new Date().toISOString(),
      },
    }))

    const created = await productModule.createProducts(payload)

    return new StepResponse(
      {
        cloned: created.map((c, i) => ({
          source_id: sources[i]?.id,
          clone_id: c.id,
        })),
        channelId: client.sales_channel_id,
      },
      created.map((c) => c.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) return
    const productModule = container.resolve(Modules.PRODUCT) as {
      deleteProducts: (ids: string[]) => Promise<void>
    }
    await productModule.deleteProducts(createdIds).catch(() => undefined)
  }
)

export const cloneClientProductsWorkflow = createWorkflow(
  "clone-client-products",
  (input: CloneInput) => {
    const result = cloneProductsStep(input)
    return new WorkflowResponse(result)
  }
)
