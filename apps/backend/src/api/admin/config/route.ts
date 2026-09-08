import fs from "fs"
import path from "path"
import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

function getConfigPath(): string | undefined {
  const clientName = process.env.CLIENT_NAME
  if (!clientName) {
    return undefined
  }
  return path.resolve(process.cwd(), "clients", clientName, "config.json")
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

function requireUser(req: MedusaRequest, res: MedusaResponse): boolean {
  const user = (req as { user?: unknown }).user
  if (!user) {
    res.status(401).json({ error: "Unauthorized" })
    return false
  }
  return true
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
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2))
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
