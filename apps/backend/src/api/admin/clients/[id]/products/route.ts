import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { CLIENT_MODULE } from "../../../../../modules/client"
import type ClientModuleService from "../../../../../modules/client/service"
import type { ClientRecord } from "../../../../../utils/client-resolver"
import { requireSuperAdmin } from "../../../utils"
import { assignClientProductsWorkflow } from "../../../../../workflows/assign-client-products"
import { cloneClientProductsWorkflow } from "../../../../../workflows/clone-client-products"

const assignSchema = z
  .object({
    product_ids: z.array(z.string()).optional(),
    collection_id: z.string().optional(),
    category_id: z.string().optional(),
    mode: z.enum(["link", "clone"]).optional(),
  })
  .refine(
    (d) => d.product_ids?.length || d.collection_id || d.category_id,
    { message: "Provide product_ids, collection_id or category_id" }
  )

// POST /admin/clients/:id/products
// Bulk-assigns products to the tenant's sales channel: the turnkey "stocked
// boutique" step — pick the client's niche (a category or collection) and the
// products become visible on its storefront immediately.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  const parse = assignSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }
  const { product_ids, collection_id, category_id, mode = "link" } =
    parse.data

  const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)
  const clients = (await service.listClients(
    { id: req.params.id },
    {}
  )) as unknown as ClientRecord[]
  const client = clients[0]
  if (!client) {
    res.status(404).json({ error: "Client not found" })
    return
  }

  const productModule = req.scope.resolve(Modules.PRODUCT) as {
    listProducts: (
      filters: Record<string, unknown>,
      config?: { select?: string[] }
    ) => Promise<{ id: string }[]>
  }

  let ids = product_ids ?? []
  if (!ids.length && (collection_id || category_id)) {
    const filters: Record<string, unknown> = {}
    if (collection_id) {
      filters["collection_id"] = collection_id
    }
    if (category_id) {
      filters["categories"] = { id: category_id }
    }
    const products = await productModule.listProducts(filters, {
      select: ["id"],
    })
    ids = products.map((p) => p.id)
  }

  if (!ids.length) {
    res.status(400).json({ error: "No products matched" })
    return
  }

  try {
    if (mode === "clone") {
      const { result } = await cloneClientProductsWorkflow(req.scope).run({
        input: { clientId: client.id, productIds: ids },
      })
      res.json({
        success: true,
        mode,
        sales_channel_id: result.channelId,
        cloned: result.cloned,
      })
      return
    }

    const { result } = await assignClientProductsWorkflow(req.scope).run({
      input: { clientId: client.id, productIds: ids },
    })
    res.json({
      success: true,
      mode,
      sales_channel_id: result.channelId,
      assigned: result.linked.length,
      skipped: result.skipped,
    })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
