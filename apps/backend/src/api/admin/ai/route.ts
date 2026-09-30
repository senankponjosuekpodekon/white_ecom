import { MedusaRequest, MedusaResponse, AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import { requireUser } from "../utils"

type AiProvider = "openai" | "workers-ai" | "ollama" | "none"
type AiAction =
  | "generate"
  | "description"
  | "seo"
  | "translate"
  | "category-suggest"
  | "email-order"
  | "review-summary"
  | "legal-page"
  | "alt-tags"

const MAX_PROMPT_LENGTH = 4000
const MAX_SYSTEM_LENGTH = 2000
const MAX_CONTEXT_LENGTH = 4000
const RATE_LIMIT_MS = 5000
const rateLimits = new Map<string, number>()

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

function getUserId(req: MedusaRequest): string | undefined {
  const ctx = (req as unknown as AuthenticatedMedusaRequest).auth_context
  return ctx?.actor_id ?? ctx?.auth_identity_id
}

function checkRateLimit(userId?: string): boolean {
  if (!userId) return false
  const now = Date.now()
  const last = rateLimits.get(userId)
  if (last && now - last < RATE_LIMIT_MS) {
    return false
  }
  rateLimits.set(userId, now)
  return true
}

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
  if (!checkRateLimit(userId)) {
    res.status(429).json({ error: "Too many requests. Please wait a few seconds." })
    return
  }

  let body: z.infer<typeof requestSchema>
  try {
    body = requestSchema.parse(req.body)
  } catch (err) {
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
      error instanceof MedusaError
        ? error.message
        : "AI generation failed"
    res.status(500).json({ error: message })
  }
}

function isProviderConfigured(provider: AiProvider): boolean {
  if (provider === "openai") {
    return !!process.env.OPENAI_API_KEY
  }
  if (provider === "workers-ai") {
    return !!process.env.CLOUDFLARE_ACCOUNT_ID && !!process.env.CLOUDFLARE_API_TOKEN
  }
  if (provider === "ollama") {
    return !!process.env.OLLAMA_BASE_URL
  }
  return false
}

function buildPrompt(body: z.infer<typeof requestSchema>): { prompt: string; system?: string } {
  const userPrompt = body.prompt.trim()
  const context = body.context?.trim() ? `\n\nContexte : ${body.context.trim()}` : ""
  const type = body.type ?? "generate"

  if (type === "translate") {
    if (!body.targetLocale) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "targetLocale is required for translations"
      )
    }
    const source = body.sourceLocale ? `from ${body.sourceLocale}` : "from the source language"
    return {
      prompt: `${userPrompt}${context}`,
      system:
        body.system ??
        `Translate the text ${source} to ${body.targetLocale}. Preserve formatting, HTML tags and placeholders. Return only the translated text, without explanations.`,
    }
  }

  if (type === "description") {
    return {
      prompt: `Produit : ${userPrompt}${context}`,
      system:
        body.system ??
        "You are an e-commerce copywriter. Write a concise, appealing product description. Return only the description, no commentary.",
    }
  }

  if (type === "seo") {
    return {
      prompt: `Produit : ${userPrompt}${context}`,
      system:
        body.system ??
        "You are an SEO expert. Suggest a meta title (max 60 chars) and a meta description (max 160 chars). Return them as plain text on two lines: title, then description.",
    }
  }

  if (type === "category-suggest") {
    return {
      prompt: `Produit : ${userPrompt}${context}`,
      system:
        body.system ??
        "You are an e-commerce taxonomy expert. Suggest 3 to 5 relevant product categories or tags. Return a JSON array of strings, nothing else.",
    }
  }

  if (type === "email-order") {
    return {
      prompt: `Commande : ${userPrompt}${context}`,
      system:
        body.system ??
        "You write professional, friendly e-commerce transactional emails. Return only the email body, no subject line or commentary.",
    }
  }

  if (type === "review-summary") {
    return {
      prompt: `Avis clients : ${userPrompt}${context}`,
      system:
        body.system ??
        "You summarize customer reviews. Return a short paragraph with the main strengths and weaknesses, in the same language as the reviews.",
    }
  }

  if (type === "legal-page") {
    return {
      prompt: `Page : ${userPrompt}${context}`,
      system:
        body.system ??
        "You draft standard e-commerce legal texts. Return the text only, no legal disclaimer. It must be usable as a public store page.",
    }
  }

  if (type === "alt-tags") {
    return {
      prompt: `Produit : ${userPrompt}${context}`,
      system:
        body.system ??
        "You write concise, SEO-friendly image alt text for e-commerce products (max 125 characters). Return only the alt text, no commentary.",
    }
  }

  return { prompt: `${userPrompt}${context}`, system: body.system?.trim() }
}

async function generate(
  provider: AiProvider,
  prompt: string,
  system?: string
): Promise<string> {
  if (provider === "openai") {
    return generateOpenAI(prompt, system)
  }
  if (provider === "workers-ai") {
    return generateWorkersAI(prompt, system)
  }
  if (provider === "ollama") {
    return generateOllama(prompt, system)
  }
  throw new MedusaError(
    MedusaError.Types.INVALID_DATA,
    "Unsupported AI provider"
  )
}

async function generateOpenAI(prompt: string, system?: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "OPENAI_API_KEY is not set"
    )
  }

  const messages: Array<{ role: string; content: string }> = []
  if (system) {
    messages.push({ role: "system", content: system })
  }
  messages.push({ role: "user", content: prompt })

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
    signal: AbortSignal.timeout(30000),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "OpenAI request failed"
    )
  }
  return data.choices?.[0]?.message?.content?.trim() ?? ""
}

async function generateWorkersAI(
  prompt: string,
  system?: string
): Promise<string> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_API_TOKEN
  if (!accountId || !token) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required"
    )
  }

  const model = process.env.CLOUDFLARE_AI_MODEL ?? "@cf/meta/llama-3-8b-instruct"
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
      }),
      signal: AbortSignal.timeout(30000),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Workers AI request failed"
    )
  }
  return data.result?.response?.trim() ?? ""
}

async function generateOllama(
  prompt: string,
  system?: string
): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL
  if (!baseUrl) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "OLLAMA_BASE_URL is not set"
    )
  }

  const model = process.env.OLLAMA_MODEL ?? "llama3.2"
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      system,
      stream: false,
      options: {
        num_predict: 1000,
      },
    }),
    signal: AbortSignal.timeout(30000),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Ollama request failed"
    )
  }
  return data.response?.trim() ?? ""
}
