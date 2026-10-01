import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  resolveClientContent,
  saveClientContentDb,
} from "../../../utils/client-config"
import type { ClientContent } from "../../../utils/default-content"
import { requireUser } from "../utils"

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

  const content = await resolveClientContent(req.scope)
  res.json({ content })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
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
    await saveClientContentDb(req.scope, content as ClientContent)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
