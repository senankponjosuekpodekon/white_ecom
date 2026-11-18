import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { createUserAccountWorkflow } from "@medusajs/medusa/core-flows"
import { CLIENT_MODULE } from "../../../../../modules/client"
import type ClientModuleService from "../../../../../modules/client/service"
import type { ClientRecord } from "../../../../../utils/client-resolver"
import { requireSuperAdmin } from "../../../utils"
import { provisionClientWorkflow } from "../../../../../workflows/provision-client"
import { updateClientWorkflow } from "../../../../../workflows/update-client"
import { assignClientProductsWorkflow } from "../../../../../workflows/assign-client-products"
import { cloneClientProductsWorkflow } from "../../../../../workflows/clone-client-products"
import { addVercelDomain, vercelConfigured } from "../../../../../utils/vercel"

const deliverSchema = z.object({
  products: z
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
    .optional(),
  member: z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
    })
    .optional(),
  domain: z
    .string()
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid domain")
    .transform((d) => d.toLowerCase().trim())
    .optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
})

function vercelProjectName(slug: string): string {
  return `shop-${slug}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .slice(0, 52)
}

// POST /admin/clients/:id/deliver
// Turnkey boutique delivery in a single call: provisions the tenant when not
// already active, merges brand config/content, fills the storefront with the
// niche products (link or clone), creates the merchant account and registers
// the custom domain. Each step reports its own outcome so a partial failure
// never leaves the client half-built silently.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  const parse = deliverSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body", issues: parse.error.issues })
    return
  }
  const { products, member, domain, config, content } = parse.data

  const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)
  const clients = (await service.listClients(
    { id: req.params.id },
    {}
  )) as unknown as ClientRecord[]
  let client = clients[0]
  if (!client) {
    res.status(404).json({ error: "Client not found" })
    return
  }

  const steps: Record<string, unknown> = {}

  if (client.status !== "active") {
    try {
      await provisionClientWorkflow(req.scope).run({
        input: {
          slug: client.slug,
          name: client.name ?? client.slug,
          contactEmail: client.contact_email ?? undefined,
          domains: client.domains ?? [],
          config,
          content,
        },
      })
      steps["provision"] = "done"
    } catch (error) {
      res.status(500).json({
        error: `Provisioning failed: ${(error as Error).message}`,
        steps,
      })
      return
    }
  } else if (config || content) {
    await updateClientWorkflow(req.scope).run({
      input: {
        id: client.id,
        ...(config
          ? { config: { ...(client.config ?? {}), ...config } }
          : {}),
        ...(content
          ? { content: { ...(client.content ?? {}), ...content } }
          : {}),
      },
    })
  }

  const refreshed = (await service.listClients(
    { id: client.id },
    {}
  )) as unknown as ClientRecord[]
  client = refreshed[0]

  if (products) {
    const productModule = req.scope.resolve(Modules.PRODUCT) as {
      listProducts: (
        filters: Record<string, unknown>,
        cfg?: { select?: string[] }
      ) => Promise<{ id: string }[]>
    }
    let ids = products.product_ids ?? []
    if (!ids.length) {
      const filters: Record<string, unknown> = {}
      if (products.collection_id) {
        filters["collection_id"] = products.collection_id
      }
      if (products.category_id) {
        filters["categories"] = { id: products.category_id }
      }
      const found = await productModule.listProducts(filters, {
        select: ["id"],
      })
      ids = found.map((p) => p.id)
    }
    if (!ids.length) {
      steps["products"] = { error: "No products matched" }
    } else {
      try {
        if (products.mode === "clone") {
          const { result } = await cloneClientProductsWorkflow(req.scope).run(
            { input: { clientId: client.id, productIds: ids } }
          )
          steps["products"] = { mode: "clone", cloned: result.cloned }
        } else {
          const { result } = await assignClientProductsWorkflow(
            req.scope
          ).run({ input: { clientId: client.id, productIds: ids } })
          steps["products"] = {
            mode: "link",
            assigned: result.linked.length,
            skipped: result.skipped,
          }
        }
      } catch (error) {
        steps["products"] = { error: (error as Error).message }
      }
    }
  }

  if (member) {
    const authModule = req.scope.resolve(Modules.AUTH) as {
      register: (
        provider: string,
        data: { body: { email: string; password: string }; authScope: string }
      ) => Promise<{
        success: boolean
        error?: string
        authIdentity?: { id: string }
      }>
    }
    const registration = await authModule.register("emailpass", {
      body: { email: member.email, password: member.password },
      authScope: "user",
    })
    if (!registration.success || !registration.authIdentity) {
      steps["member"] = {
        error: registration.error ?? "Could not register the merchant",
      }
    } else {
      try {
        const { result: user } = await createUserAccountWorkflow(
          req.scope
        ).run({
          input: {
            authIdentityId: registration.authIdentity.id,
            userData: {
              email: member.email,
              first_name: member.first_name,
              last_name: member.last_name,
              metadata: { client_id: client.id },
            },
          },
        })
        steps["member"] = { id: user.id, email: user.email }
      } catch (error) {
        steps["member"] = { error: (error as Error).message }
      }
    }
  }

  if (domain) {
    try {
      if (vercelConfigured() && client.storefront_url) {
        await addVercelDomain(vercelProjectName(client.slug), domain)
      }
      const domains = Array.from(
        new Set([...(client.domains ?? []), domain])
      )
      await updateClientWorkflow(req.scope).run({
        input: { id: client.id, domains },
      })
      steps["domain"] = {
        domain,
        dns: { type: "CNAME", name: domain, value: "cname.vercel-dns.com" },
      }
    } catch (error) {
      steps["domain"] = { error: (error as Error).message }
    }
  }

  const final = (await service.listClients(
    { id: client.id },
    {}
  )) as unknown as ClientRecord[]

  res.json({ success: true, client: final[0], steps })
}
