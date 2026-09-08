import fs from "fs"
import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { updateClientConfigWorkflow } from "../../../workflows/update-client-config"
import { requireUser, safeClientPath } from "../utils"

function getConfigPath(): string | undefined {
  return safeClientPath("config.json")
}

function readConfig() {
  const filePath = getConfigPath()
  if (!filePath) {
    return {}
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

const configSchema = z.object({
  config: z.record(z.string(), z.any()),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const config = readConfig()
  res.json({ config })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const filePath = getConfigPath()
  if (!filePath) {
    res.status(400).json({ error: "CLIENT_NAME not configured" })
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
    await updateClientConfigWorkflow(req.scope).run({ input: { config } })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
