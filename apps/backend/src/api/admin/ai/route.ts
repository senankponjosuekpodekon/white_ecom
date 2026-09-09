import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { requireUser } from "../utils"

type AiProvider = "openai" | "workers-ai" | "none"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const provider = process.env.AI_PROVIDER ?? "none"
  const configured =
    provider === "openai" ? !!process.env.OPENAI_API_KEY : provider === "workers-ai" ? !!process.env.CLOUDFLARE_ACCOUNT_ID && !!process.env.CLOUDFLARE_API_TOKEN : false

  res.json({ provider, configured })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const body = req.body as { prompt?: string; system?: string }
  const prompt = body.prompt?.trim()
  if (!prompt) {
    res.status(400).json({ error: "Prompt is required" })
    return
  }

  const provider = (process.env.AI_PROVIDER ?? "none") as AiProvider
  if (provider === "none") {
    res.status(400).json({
      error:
        "AI_PROVIDER is not configured. Set AI_PROVIDER=openai or workers-ai and the matching credentials.",
    })
    return
  }

  try {
    const text = await generate(provider, prompt, body.system)
    res.json({ text })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
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
