import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CLIENT_MODULE } from "../../../../modules/client"
import type ClientModuleService from "../../../../modules/client/service"
import type { ClientRecord } from "../../../../utils/client-resolver"
import { updateClientWorkflow } from "../../../../workflows/update-client"
import { requireSuperAdmin } from "../../utils"

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  contact_email: z.string().email().nullable().optional(),
  domains: z.array(z.string()).optional(),
  status: z.enum(["pending", "suspended", "rejected", "active"]).optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
})

export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  const parse = updateSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }

  const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)
  const id = req.params.id
  const { name, contact_email, domains, status, config, content } = parse.data

  try {
    await updateClientWorkflow(req.scope).run({
      input: { id, name, contact_email, domains, status, config, content },
    })
    const [client] = (await service.listClients(
      { id },
      {}
    )) as unknown as ClientRecord[]
    res.json({ success: true, client })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
