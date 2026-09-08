import fs from "fs"
import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { defaultContent } from "../../../utils/default-content"
import { updateClientContentWorkflow } from "../../../workflows/update-client-content"
import { requireUser, safeClientPath } from "../utils"

function getContentPath(): string | undefined {
  return safeClientPath("content.json")
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

const contentSchema = z.object({
  content: z
    .record(z.string(), z.any())
    .refine(
      (val) => typeof val === "object" && val !== null && !Array.isArray(val),
      { message: "content must be an object" }
    ),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const content = readContent()
  res.json({ content })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const filePath = getContentPath()
  if (!filePath) {
    res.status(400).json({ error: "CLIENT_NAME not configured" })
    return
  }

  const parse = contentSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({
      error: "Invalid body",
      issues: parse.error.issues.map((i) => i.message),
    })
    return
  }

  const { content } = parse.data

  try {
    await updateClientContentWorkflow(req.scope).run({ input: { content } })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
