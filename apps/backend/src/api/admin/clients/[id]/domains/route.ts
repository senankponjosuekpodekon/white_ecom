import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CLIENT_MODULE } from "../../../../../modules/client"
import type ClientModuleService from "../../../../../modules/client/service"
import type { ClientRecord } from "../../../../../utils/client-resolver"
import { requireSuperAdmin } from "../../../utils"
import { updateClientWorkflow } from "../../../../../workflows/update-client"
import {
  addVercelDomain,
  removeVercelDomain,
  vercelConfigured,
} from "../../../../../utils/vercel"

const domainSchema = z.object({
  domain: z
    .string()
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid domain")
    .transform((d) => d.toLowerCase().trim()),
})

function vercelProjectName(slug: string): string {
  return `shop-${slug}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .slice(0, 52)
}

async function getClient(
  service: ClientModuleService,
  id: string
): Promise<ClientRecord | undefined> {
  const clients = (await service.listClients(
    { id },
    {}
  )) as unknown as ClientRecord[]
  return clients[0]
}

// POST /admin/clients/:id/domains { domain }
// Registers the domain on the tenant's Vercel project and stores it on the
// client so resolveRequestClient can resolve that host to the tenant.
// Returns the DNS record the merchant has to create.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  const parse = domainSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }
  const domain = parse.data.domain

  const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)
  const client = await getClient(service, req.params.id)
  if (!client) {
    res.status(404).json({ error: "Client not found" })
    return
  }

  if (vercelConfigured() && client.storefront_url) {
    try {
      await addVercelDomain(vercelProjectName(client.slug), domain)
    } catch (error) {
      res
        .status(502)
        .json({ error: `Vercel rejected the domain: ${(error as Error).message}` })
      return
    }
  }

  const domains = Array.from(
    new Set([...(client.domains ?? []), domain])
  )
  await updateClientWorkflow(req.scope).run({
    input: { id: client.id, domains },
  })

  res.json({
    success: true,
    domain,
    domains: [...(client.domains ?? []), domain],
    dns: {
      type: "CNAME",
      name: domain,
      value: "cname.vercel-dns.com",
    },
  })
}

// DELETE /admin/clients/:id/domains { domain }
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  const parse = domainSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }
  const domain = parse.data.domain

  const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)
  const client = await getClient(service, req.params.id)
  if (!client) {
    res.status(404).json({ error: "Client not found" })
    return
  }

  if (vercelConfigured() && client.storefront_url) {
    await removeVercelDomain(vercelProjectName(client.slug), domain).catch(
      () => undefined
    )
  }

  const remaining = (client.domains ?? []).filter((d) => d !== domain)
  await updateClientWorkflow(req.scope).run({
    input: { id: client.id, domains: remaining },
  })

  res.json({ success: true, domains: remaining })
}
