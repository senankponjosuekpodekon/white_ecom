import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  resolveClientConfig,
  saveClientConfigDb,
} from "../../../utils/client-config"
import { requireUser } from "../utils"

const configSchema = z.object({
  config: z.record(z.string(), z.any()),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const config = await resolveClientConfig(req.scope)
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
    await saveClientConfigDb(req.scope, config)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
