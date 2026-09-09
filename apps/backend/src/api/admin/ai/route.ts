import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { requireUser } from "../utils"

type AiProvider = "openai" | "workers-ai" | "ollama" | "none"
type AiAction = "generate" | "description" | "seo" | "translate"

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

  const body = req.body as {
    type?: AiAction
    prompt?: string
    system?: string
    sourceLocale?: string
    targetLocale?: string
  }

  const provider = (process.env.AI_PROVIDER ?? "none") as AiProvider
  if (provider === "none") {
    res.status(400).json({
      error:
        "AI_PROVIDER is not configured. Set AI_PROVIDER=openai, ollama or workers-ai and the matching credentials.",
    })
    return
  }

  const { prompt, system } = buildPrompt(body)
  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" })
    return
  }

  try {
    const text = await generate(provider, prompt, system)
    res.json({ text })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
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

function buildPrompt(body: {
  type?: AiAction
  prompt?: string
  system?: string
  sourceLocale?: string
  targetLocale?: string
}): { prompt: string | undefined; system: string | undefined } {
  const userPrompt = body.prompt?.trim()
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
      prompt: userPrompt,
      system: `Translate the text ${source} to ${body.targetLocale}. Preserve formatting, HTML tags and placeholders. Return only the translated text, without explanations.`,
    }
  }

  if (type === "description") {
    return {
      prompt: userPrompt,
      system:
        body.system ??
        "You are an e-commerce copywriter. Write a concise, appealing product description. Return only the description, no commentary.",
    }
  }

  if (type === "seo") {
    return {
      prompt: userPrompt,
      system:
        body.system ??
        "You are an SEO expert. Suggest a meta title (max 60 chars) and a meta description (max 160 chars) for the product described below. Return them as plain text on two lines: title, then description.",
    }
  }

  return { prompt: userPrompt, system: body.system?.trim() }
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
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      data.error?.message ?? "OpenAI request failed"
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
      }),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      data.errors?.[0]?.message ?? data.messages?.[0] ?? "Workers AI request failed"
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
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      data.error ?? "Ollama request failed"
    )
  }
  return data.response?.trim() ?? ""
}
