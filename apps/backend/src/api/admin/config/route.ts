import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  resolveClientConfig,
  saveClientConfigDb,
} from "../../../utils/client-config"
import { requireUser, tenantClient } from "../utils"
import { updateClientWorkflow } from "../../../workflows/update-client"

const configSchema = z.object({
  config: z.record(z.string(), z.any()),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const client = await tenantClient(req)
  const config = await resolveClientConfig(req.scope, client)
  res.json({ config })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const parse = configSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({
      error: "Invalid body",
      issues: parse.error.issues.map((i) => i.message),
    })
    return
  }

  const { config } = parse.data

  try {
    // Tenant scope: write to client.config so the tenant's storefront picks
    // it up; platform scope: legacy store metadata.
    const client = await tenantClient(req)
    if (client) {
      await updateClientWorkflow(req.scope).run({
        input: { id: client.id, config },
      })
    } else {
      await saveClientConfigDb(req.scope, config)
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
