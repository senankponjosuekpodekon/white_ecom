import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { requireUser } from "../utils"
import {
  AiProvider,
  buildPrompt,
  checkRateLimit,
  generate,
  getUserId,
  isProviderConfigured,
} from "../../../utils/ai"

const MAX_PROMPT_LENGTH = 4000
const MAX_SYSTEM_LENGTH = 2000
const MAX_CONTEXT_LENGTH = 4000

const requestSchema = z.object({
  type: z.enum([
    "generate",
    "description",
    "seo",
    "translate",
    "category-suggest",
    "email-order",
    "review-summary",
    "legal-page",
    "alt-tags",
  ]).optional(),
  prompt: z.string().min(1).max(MAX_PROMPT_LENGTH),
  context: z.string().max(MAX_CONTEXT_LENGTH).optional(),
  system: z.string().max(MAX_SYSTEM_LENGTH).optional(),
  sourceLocale: z.string().max(10).optional(),
  targetLocale: z.string().max(10).optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const provider = process.env.AI_PROVIDER ?? "none"
  const configured = isProviderConfigured(provider as AiProvider)

  res.json({ provider, configured })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const userId = getUserId(req)
  if (!(await checkRateLimit(userId))) {
    res.status(429).json({ error: "Too many requests. Please wait a few seconds." })
    return
  }

  let body: z.infer<typeof requestSchema>
  try {
    body = requestSchema.parse(req.body)
  } catch {
    res.status(400).json({ error: "Invalid request body" })
    return
  }

  const provider = (process.env.AI_PROVIDER ?? "none") as AiProvider
  if (provider === "none" || !isProviderConfigured(provider)) {
    res.status(400).json({
      error:
        "AI_PROVIDER is not configured. Set AI_PROVIDER=openai, ollama or workers-ai and the matching credentials.",
    })
    return
  }

  const { prompt, system } = buildPrompt(body)

  try {
    const text = await generate(provider, prompt, system)
    res.json({ text })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "AI generation failed"

    const fallback = process.env.AI_PROVIDER_FALLBACK as AiProvider | undefined
    if (fallback && fallback !== provider && isProviderConfigured(fallback)) {
      try {
        const text = await generate(fallback, prompt, system)
        res.json({ text })
        return
      } catch {
        res.status(500).json({ error: message })
        return
      }
    }

    res.status(500).json({ error: message })
  }
}
