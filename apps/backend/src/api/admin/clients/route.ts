import fs from "fs"
import path from "path"
import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CLIENT_MODULE } from "../../../modules/client"
import type ClientModuleService from "../../../modules/client/service"
import type { ClientRecord } from "../../../utils/client-resolver"
import { provisionClientWorkflow } from "../../../workflows/provision-client"
import { createClientRequestWorkflow } from "../../../workflows/client-request"
import { requireSuperAdmin, isValidClientName } from "../utils"

const clientsDir = path.resolve(process.cwd(), "clients")

const createSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine(isValidClientName, {
      message: "Client name must contain only lowercase letters, digits and dashes",
    }),
  domain: z
    .string()
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid domain")
    .optional(),
  contact_email: z.string().email().optional(),
  provision: z.boolean().optional(),
})

function sanitizeClient(client: ClientRecord) {
  return {
    ...client,
    publishable_key: client.publishable_key
      ? `${client.publishable_key.slice(0, 12)}...`
      : null,
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  try {
    const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)
    const clients = (await service.listClients(
      {},
      { order: { created_at: "DESC" } }
    )) as unknown as ClientRecord[]

    const dirs = fs.existsSync(clientsDir)
      ? fs
          .readdirSync(clientsDir, { withFileTypes: true })
          .filter((d) => d.isDirectory())
          .map((d) => d.name)
      : []

    res.json({
      current: process.env.CLIENT_NAME ?? "default",
      fileClients: dirs,
      clients: clients.map(sanitizeClient),
    })
  } catch {
    res.json({ current: process.env.CLIENT_NAME ?? "default", clients: [] })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  const parse = createSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }

  const { name, domain, contact_email, provision } = parse.data
  const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)

  try {
    if (provision !== false) {
      const { result } = await provisionClientWorkflow(req.scope).run({
        input: {
          slug: name,
          contactEmail: contact_email,
          domains: domain ? [domain] : [],
        },
      })
      const [client] = (await service.listClients(
        { id: result.id },
        {}
      )) as unknown as ClientRecord[]
      res.status(201).json({ success: true, client: sanitizeClient(client) })
      return
    }

    const { result } = await createClientRequestWorkflow(req.scope).run({
      input: {
        slug: name,
        name,
        contactEmail: contact_email,
        domains: domain ? [domain] : [],
      },
    })
    const [created] = (await service.listClients(
      { id: result.id },
      {}
    )) as unknown as ClientRecord[]
    res.status(201).json({ success: true, client: sanitizeClient(created) })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
