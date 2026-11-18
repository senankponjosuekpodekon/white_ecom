import { MedusaError } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CLIENT_MODULE } from "../modules/client"
import type ClientModuleService from "../modules/client/service"
import type { ClientRecord } from "../utils/client-resolver"
import { generateStorefrontContent } from "../utils/ai"

type GenerateClientContentInput = {
  clientId: string
  locales?: string[]
}

type LocalizedContent = Record<string, unknown>

const AI_CONTENT_KEYS = [
  "tagline",
  "description",
  "hero_title",
  "hero_subtitle",
  "cta_label",
  "about",
  "seo_title",
  "seo_description",
  "legal_terms",
  "legal_privacy",
] as const

function mergeGenerated(
  base: LocalizedContent,
  generated: Record<string, unknown>
): LocalizedContent {
  const str = (k: string) =>
    typeof generated[k] === "string" ? (generated[k] as string) : undefined

  return {
    ...base,
    site: {
      ...(base["site"] as Record<string, unknown> | undefined),
      description: str("seo_description"),
      titleTemplate: str("seo_title"),
    },
    hero: {
      ...(base["hero"] as Record<string, unknown> | undefined),
      title: str("hero_title"),
      subtitle: str("hero_subtitle"),
      cta: str("cta_label"),
    },
    valueProposition: {
      ...(base["valueProposition"] as Record<string, unknown> | undefined),
      title: str("tagline"),
      text: str("about") ?? str("description"),
    },
    cta: {
      ...(base["cta"] as Record<string, unknown> | undefined),
      title: str("tagline"),
      subtitle: str("description"),
      button: str("cta_label"),
    },
    legal: {
      ...(base["legal"] as Record<string, unknown> | undefined),
      terms: str("legal_terms"),
      mentions: str("legal_privacy"),
    },
    policies: {
      ...(base["policies"] as Record<string, unknown> | undefined),
      privacy: str("legal_privacy"),
    },
    footer: {
      ...(base["footer"] as Record<string, unknown> | undefined),
      text: str("description"),
    },
  }
}

const generateContentStep = createStep(
  "generate-content",
  async (input: GenerateClientContentInput, { container }) => {
    const service = container.resolve<ClientModuleService>(CLIENT_MODULE)
    const clients = (await service.listClients(
      { id: input.clientId },
      {}
    )) as unknown as ClientRecord[]
    const client = clients[0]
    if (!client) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Client ${input.clientId} not found`
      )
    }

    const config = (client.config ?? {}) as Record<string, unknown>
    const content = (client.content ?? {}) as Record<string, LocalizedContent>

    const locales =
      input.locales ??
      (Array.isArray(config["locales"])
        ? (config["locales"] as string[])
        : undefined) ??
      [String(config["defaultLocale"] ?? "fr"), "en"]

    const written: string[] = []
    const previous: Record<string, LocalizedContent> = {}
    for (const locale of locales) {
      const generated = await generateStorefrontContent({
        name: client.name ?? client.slug,
        niche: String(config["niche"] ?? "") || undefined,
        businessModel:
          String(config["businessModel"] ?? "") || undefined,
        locale,
      })
      if (!generated) continue

      previous[locale] = content[locale] ?? {}
      content[locale] = mergeGenerated(content[locale] ?? {}, generated)
      written.push(locale)
    }

    if (written.length) {
      await service.updateClients({ id: client.id, content })
    }

    return new StepResponse(
      { clientId: client.id, written },
      { clientId: client.id, previous }
    )
  },
  async (compensation, { container }) => {
    if (!compensation?.previous) return
    const service = container.resolve<ClientModuleService>(CLIENT_MODULE)
    const clients = (await service.listClients(
      { id: compensation.clientId },
      {}
    )) as unknown as ClientRecord[]
    const client = clients[0]
    if (!client) return
    const content = { ...(client.content ?? {}) } as Record<
      string,
      LocalizedContent
    >
    for (const [locale, prev] of Object.entries(compensation.previous)) {
      content[locale] = prev
    }
    await service.updateClients({ id: client.id, content })
  }
)

export const generateClientContentWorkflow = createWorkflow(
  "generate-client-content",
  (input: GenerateClientContentInput) => {
    const result = generateContentStep(input)
    return new WorkflowResponse(result)
  }
)
