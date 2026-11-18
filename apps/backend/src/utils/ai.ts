import { AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import Redis from "ioredis"

export type AiProvider = "openai" | "workers-ai" | "ollama" | "none"
export type AiAction =
  | "generate"
  | "description"
  | "seo"
  | "translate"
  | "category-suggest"
  | "email-order"
  | "review-summary"
  | "legal-page"
  | "alt-tags"
  | "storefront-content"

export interface AiRequestBody {
  type?: AiAction
  prompt: string
  context?: string
  system?: string
  sourceLocale?: string
  targetLocale?: string
}

export const RATE_LIMIT_MS = 5000

const memoryRateLimits = new Map<string, number>()
let redisClient: Redis | null = null
let redisUnavailable = false

function getRedis(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url || redisUnavailable) return null
  if (!redisClient) {
    redisClient = new Redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    })
    redisClient.on("error", () => {
      redisUnavailable = true
    })
  }
  return redisClient
}

export function getUserId(req: unknown): string | undefined {
  const ctx = (req as AuthenticatedMedusaRequest).auth_context
  return ctx?.actor_id ?? ctx?.auth_identity_id
}

export async function checkRateLimit(userId?: string): Promise<boolean> {
  if (!userId) return false
  const redis = getRedis()
  if (redis) {
    try {
      const res = await redis.set(`ai:rate:${userId}`, "1", "PX", RATE_LIMIT_MS, "NX")
      return res === "OK"
    } catch {
      redisUnavailable = true
    }
  }
  const now = Date.now()
  const last = memoryRateLimits.get(userId)
  if (last && now - last < RATE_LIMIT_MS) return false
  memoryRateLimits.set(userId, now)
  return true
}

export function isProviderConfigured(provider: AiProvider): boolean {
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

export function buildPrompt(body: AiRequestBody): { prompt: string; system?: string } {
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

export async function generate(
  provider: AiProvider,
  prompt: string,
  system?: string,
  maxTokens = 1000
): Promise<string> {
  if (provider === "openai") {
    return generateOpenAI(prompt, system, maxTokens)
  }
  if (provider === "workers-ai") {
    return generateWorkersAI(prompt, system, maxTokens)
  }
  if (provider === "ollama") {
    return generateOllama(prompt, system, maxTokens)
  }
  throw new MedusaError(
    MedusaError.Types.INVALID_DATA,
    "Unsupported AI provider"
  )
}

export function resolveProvider(): AiProvider {
  const requested = (process.env.AI_PROVIDER ?? "").trim() as AiProvider
  if (requested && requested !== "none" && isProviderConfigured(requested)) {
    return requested
  }
  for (const p of ["openai", "workers-ai", "ollama"] as const) {
    if (isProviderConfigured(p)) return p
  }
  return "none"
}

export interface StorefrontContentInput {
  name: string
  niche?: string
  businessModel?: string
  locale: string
}

// One-shot brand copy for a turnkey boutique: tagline, hero, about, SEO and
// the standard legal pages, in the requested locale. Returns parsed JSON —
// the caller decides what to persist into client.content.
export async function generateStorefrontContent(
  input: StorefrontContentInput
): Promise<Record<string, unknown> | null> {
  const provider = resolveProvider()
  if (provider === "none") return null

  const system =
    "You are an e-commerce branding expert delivering turnkey boutiques. " +
    `Write all texts in ${input.locale}. ` +
    "Return ONLY a JSON object with keys: tagline (short slogan), " +
    "description (2-3 sentences shop presentation), hero_title, hero_subtitle, " +
    "cta_label (short call-to-action), about (one paragraph), " +
    "seo_title (max 60 chars), seo_description (max 160 chars), " +
    "legal_terms (standard CGV text), legal_privacy (standard privacy policy). " +
    "No markdown, no commentary, valid JSON only."
  const prompt =
    `Boutique : ${input.name}` +
    (input.niche ? `\nNiche : ${input.niche}` : "") +
    (input.businessModel ? `\nModèle : ${input.businessModel}` : "")

  try {
    const raw = await generate(provider, prompt, system, 3000)
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return null
    return JSON.parse(match[0]) as Record<string, unknown>
  } catch {
    return null
  }
}

async function generateOpenAI(
  prompt: string,
  system?: string,
  maxTokens = 1000
): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "OPENAI_API_KEY is not set"
    )
  }

  const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "")
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini"

  const messages: Array<{ role: string; content: string }> = []
  if (system) {
    messages.push({ role: "system", content: system })
  }
  messages.push({ role: "user", content: prompt })

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: maxTokens,
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
  system?: string,
  maxTokens = 1000
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
        max_tokens: maxTokens,
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
  system?: string,
  maxTokens = 1000
): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL
  if (!baseUrl) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "OLLAMA_BASE_URL is not set"
    )
  }

  const model = process.env.OLLAMA_MODEL ?? "llama3.2"
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  const cfClientId = process.env.OLLAMA_CF_ACCESS_CLIENT_ID
  const cfClientSecret = process.env.OLLAMA_CF_ACCESS_CLIENT_SECRET
  if (cfClientId && cfClientSecret) {
    headers["CF-Access-Client-Id"] = cfClientId
    headers["CF-Access-Client-Secret"] = cfClientSecret
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      prompt,
      system,
      stream: false,
      options: {
        num_predict: maxTokens,
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
