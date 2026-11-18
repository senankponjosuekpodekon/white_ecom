import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { createUserAccountWorkflow } from "@medusajs/medusa/core-flows"
import { CLIENT_MODULE } from "../../../../../modules/client"
import type ClientModuleService from "../../../../../modules/client/service"
import type { ClientRecord } from "../../../../../utils/client-resolver"
import { requireSuperAdmin } from "../../../utils"

const memberSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

// POST /admin/clients/:id/members
// Creates a merchant account (Medusa admin user) bound to the tenant through
// user metadata client_id. The /admin/* middleware scopes every request from
// this user to the tenant's sales channel.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  const parse = memberSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }
  const { email, password, first_name, last_name } = parse.data

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
    body: { email, password },
    authScope: "user",
  })
  if (!registration.success || !registration.authIdentity) {
    res.status(400).json({
      error: registration.error ?? "Could not register the merchant",
    })
    return
  }

  try {
    const { result: user } = await createUserAccountWorkflow(req.scope).run({
      input: {
        authIdentityId: registration.authIdentity.id,
        userData: {
          email,
          first_name,
          last_name,
          metadata: { client_id: client.id },
        },
      },
    })
    res.status(201).json({
      success: true,
      member: { id: user.id, email: user.email, client_id: client.id },
    })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
