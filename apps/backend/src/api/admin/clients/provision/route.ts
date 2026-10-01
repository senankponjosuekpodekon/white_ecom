import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CLIENT_MODULE } from "../../../../modules/client"
import type ClientModuleService from "../../../../modules/client/service"
import type { ClientRecord } from "../../../../utils/client-resolver"
import { provisionClientWorkflow } from "../../../../workflows/provision-client"
import { updateClientWorkflow } from "../../../../workflows/update-client"
import { requireSuperAdmin, isValidClientName } from "../../utils"

const provisionSchema = z.object({
  slug: z.string().min(1).refine(isValidClientName),
  name: z.string().min(1).optional(),
  contact_email: z.string().email().optional(),
  domain: z
    .string()
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid domain")
    .optional(),
})

// Provisioning control plane: runs the provisioning workflow in-process —
// creates/updates the client row, a dedicated sales channel, a publishable
// API key linked to it, and (when VERCEL_TOKEN/VERCEL_GIT_REPO are set) a
// Vercel project wired to that key. No containers are spawned from this
// backend; hosted APIs do the work.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) return

  const parse = provisionSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }

  const { slug, name, contact_email, domain } = parse.data
  const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)

  try {
    const { result } = await provisionClientWorkflow(req.scope).run({
      input: {
        slug,
        name,
        contactEmail: contact_email,
        domains: domain ? [domain] : [],
      },
    })
    const [client] = (await service.listClients(
      { id: result.id },
      {}
    )) as unknown as ClientRecord[]
    res.json({ success: true, client })
  } catch (error) {
    const existing = (await service
      .listClients({ slug }, {})
      .catch(() => [])) as unknown as ClientRecord[]
    if (existing[0]) {
      await updateClientWorkflow(req.scope)
        .run({
          input: {
            id: existing[0].id,
            status: "failed",
            error: (error as Error).message,
          },
        })
        .catch(() => undefined)
    }
    res.status(500).json({ error: (error as Error).message })
  }
}
