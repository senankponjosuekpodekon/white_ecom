import fs from "fs"
import path from "path"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { defaultContent } from "../../../utils/default-content"

function getContentPath(): string | undefined {
  const clientName = process.env.CLIENT_NAME
  if (!clientName) {
    return undefined
  }
  return path.resolve(process.cwd(), "clients", clientName, "content.json")
}

function readContent() {
  const filePath = getContentPath()
  if (!filePath) {
    return defaultContent
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(raw)
  } catch {
    return defaultContent
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const content = readContent()
  res.json({ content })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const filePath = getContentPath()
  if (!filePath) {
    res.status(400).json({ error: "CLIENT_NAME not configured" })
    return
  }

  const body = req.body as { content?: Record<string, unknown> }
  if (!body?.content || typeof body.content !== "object") {
    res.status(400).json({ error: "Missing content" })
    return
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(body.content, null, 2))
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
