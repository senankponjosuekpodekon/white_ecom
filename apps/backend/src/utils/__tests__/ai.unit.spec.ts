import {
  buildPrompt,
  checkRateLimit,
  generate,
  isProviderConfigured,
} from "../ai"

const ORIGINAL_ENV = { ...process.env }

beforeEach(() => {
  delete process.env.OPENAI_API_KEY
  delete process.env.OPENAI_BASE_URL
  delete process.env.OPENAI_MODEL
  delete process.env.CLOUDFLARE_ACCOUNT_ID
  delete process.env.CLOUDFLARE_API_TOKEN
  delete process.env.CLOUDFLARE_AI_MODEL
  delete process.env.OLLAMA_BASE_URL
  delete process.env.OLLAMA_MODEL
  delete process.env.OLLAMA_CF_ACCESS_CLIENT_ID
  delete process.env.OLLAMA_CF_ACCESS_CLIENT_SECRET
  delete process.env.REDIS_URL
})

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  jest.restoreAllMocks()
})

describe("isProviderConfigured", () => {
  it("returns false when provider is none", () => {
    expect(isProviderConfigured("none")).toBe(false)
  })

  it("requires OPENAI_API_KEY for openai", () => {
    expect(isProviderConfigured("openai")).toBe(false)
    process.env.OPENAI_API_KEY = "key"
    expect(isProviderConfigured("openai")).toBe(true)
  })

  it("requires both credentials for workers-ai", () => {
    expect(isProviderConfigured("workers-ai")).toBe(false)
    process.env.CLOUDFLARE_ACCOUNT_ID = "acc"
    expect(isProviderConfigured("workers-ai")).toBe(false)
    process.env.CLOUDFLARE_API_TOKEN = "tok"
    expect(isProviderConfigured("workers-ai")).toBe(true)
  })

  it("requires OLLAMA_BASE_URL for ollama", () => {
    expect(isProviderConfigured("ollama")).toBe(false)
    process.env.OLLAMA_BASE_URL = "http://localhost:11434"
    expect(isProviderConfigured("ollama")).toBe(true)
  })
})

describe("buildPrompt", () => {
  it("builds a description prompt prefixed with the product", () => {
    const { prompt, system } = buildPrompt({ type: "description", prompt: "T-shirt" })
    expect(prompt).toContain("Produit : T-shirt")
    expect(system).toContain("copywriter")
  })

  it("appends context when provided", () => {
    const { prompt } = buildPrompt({
      type: "description",
      prompt: "T-shirt",
      context: "Prix: 19 EUR",
    })
    expect(prompt).toContain("Contexte : Prix: 19 EUR")
  })

  it("prefers a custom system prompt over the default", () => {
    const { system } = buildPrompt({
      type: "description",
      prompt: "T-shirt",
      system: "custom",
    })
    expect(system).toBe("custom")
  })

  it("throws when translate has no targetLocale", () => {
    expect(() =>
      buildPrompt({ type: "translate", prompt: "Bonjour" })
    ).toThrow("targetLocale")
  })

  it("builds a translate prompt with locales", () => {
    const { system } = buildPrompt({
      type: "translate",
      prompt: "Bonjour",
      sourceLocale: "fr",
      targetLocale: "en",
    })
    expect(system).toContain("fr")
    expect(system).toContain("en")
  })

  it("asks for a JSON array on category-suggest", () => {
    const { system } = buildPrompt({ type: "category-suggest", prompt: "T-shirt" })
    expect(system).toContain("JSON array")
  })

  it("returns the raw prompt for generate without type", () => {
    const { prompt } = buildPrompt({ prompt: "  hello  " })
    expect(prompt).toBe("hello")
  })
})

describe("checkRateLimit (in-memory)", () => {
  it("denies when userId is missing", async () => {
    expect(await checkRateLimit(undefined)).toBe(false)
  })

  it("allows the first call and blocks a rapid second call", async () => {
    expect(await checkRateLimit("u1")).toBe(true)
    expect(await checkRateLimit("u1")).toBe(false)
  })

  it("allows again after the window expires", async () => {
    jest.useFakeTimers()
    try {
      expect(await checkRateLimit("u2")).toBe(true)
      jest.setSystemTime(Date.now() + 6000)
      expect(await checkRateLimit("u2")).toBe(true)
    } finally {
      jest.useRealTimers()
    }
  })
})

describe("generate", () => {
  it("rejects unsupported providers", async () => {
    await expect(generate("none", "hello")).rejects.toThrow("Unsupported")
  })

  it("calls the OpenAI-compatible endpoint with model and auth header", async () => {
    process.env.OPENAI_API_KEY = "sk-test"
    process.env.OPENAI_BASE_URL = "https://api.groq.com/openai/v1/"
    process.env.OPENAI_MODEL = "openai/gpt-oss-120b"

    const fetchSpy = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
        json: async () => ({ choices: [{ message: { content: " ok " } }] }),
      } as Response)

    const text = await generate("openai", "hello")
    expect(text).toBe("ok")

    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe("https://api.groq.com/openai/v1/chat/completions")
    const headers = (init as RequestInit).headers as Record<string, string>
    expect(headers.Authorization).toBe("Bearer sk-test")
    const body = JSON.parse((init as RequestInit).body as string)
    expect(body.model).toBe("openai/gpt-oss-120b")
  })

  it("throws a generic error when the provider request fails", async () => {
    process.env.OPENAI_API_KEY = "sk-test"
    jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response)

    await expect(generate("openai", "hello")).rejects.toThrow("OpenAI request failed")
  })

  it("sends Cloudflare Access headers for Ollama when configured", async () => {
    process.env.OLLAMA_BASE_URL = "https://ollama.example.com"
    process.env.OLLAMA_CF_ACCESS_CLIENT_ID = "cf-id"
    process.env.OLLAMA_CF_ACCESS_CLIENT_SECRET = "cf-secret"

    const fetchSpy = jest
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        ok: true,
        json: async () => ({ response: "hi" }),
      } as Response)

    const text = await generate("ollama", "hello")
    expect(text).toBe("hi")

    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe("https://ollama.example.com/api/generate")
    const headers = (init as RequestInit).headers as Record<string, string>
    expect(headers["CF-Access-Client-Id"]).toBe("cf-id")
    expect(headers["CF-Access-Client-Secret"]).toBe("cf-secret")
  })
})
