import { MedusaError } from "@medusajs/framework/utils"
import { isProviderConfigured, type AiProvider } from "./ai"

export const EMBEDDING_PROVIDER_ORDER: AiProvider[] = [
  "openai",
  "ollama",
  "workers-ai",
]

export function embeddingProvider(): AiProvider | null {
  for (const provider of EMBEDDING_PROVIDER_ORDER) {
    if (isProviderConfigured(provider)) return provider
  }
  return null
}

export async function embedText(text: string): Promise<number[]> {
  const provider = embeddingProvider()
  if (!provider) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "No embedding-capable AI provider configured"
    )
  }
  const input = text.slice(0, 8000)

  if (provider === "openai") {
    const baseUrl = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "")
    const model = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small"
    const res = await fetch(`${baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model, input }),
    })
    if (!res.ok) throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `Embedding request failed: ${res.status}`)
    const data = await res.json()
    return data.data?.[0]?.embedding ?? []
  }

  if (provider === "ollama") {
    const baseUrl = (process.env.OLLAMA_BASE_URL ?? "").replace(/\/$/, "")
    const model = process.env.OLLAMA_EMBEDDING_MODEL ?? "nomic-embed-text"
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    const cfClientId = process.env.OLLAMA_CF_ACCESS_CLIENT_ID
    const cfClientSecret = process.env.OLLAMA_CF_ACCESS_CLIENT_SECRET
    if (cfClientId && cfClientSecret) {
      headers["CF-Access-Client-Id"] = cfClientId
      headers["CF-Access-Client-Secret"] = cfClientSecret
    }
    const res = await fetch(`${baseUrl}/api/embeddings`, {
      method: "POST",
      headers,
      body: JSON.stringify({ model, prompt: input }),
    })
    if (!res.ok) throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `Ollama embedding failed: ${res.status}`)
    const data = await res.json()
    return data.embedding ?? []
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const model = process.env.CLOUDFLARE_EMBEDDING_MODEL ?? "@cf/baai/bge-base-en-v1.5"
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: JSON.stringify({ text: input }),
    }
  )
  if (!res.ok) throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, `Workers AI embedding failed: ${res.status}`)
  const data = await res.json()
  return data.result?.data?.[0] ?? []
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return -1
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (!na || !nb) return -1
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}
