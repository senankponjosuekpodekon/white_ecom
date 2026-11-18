import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createClientRequestWorkflow } from "../../../workflows/client-request"

const requestSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(48)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, digits and dashes"),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  domain: z
    .string()
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid domain")
    .optional(),
  locale: z.enum(["fr", "en"]).optional(),
  primary_color: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i, "primary_color must be a hex color")
    .optional(),
  logo_url: z.string().url().optional(),
  preset: z.string().min(1).max(64).optional(),
  font: z.string().min(1).max(64).optional(),
  business_model: z.string().min(1).max(64).optional(),
  niche: z.string().min(1).max(64).optional(),
  description: z.string().max(2000).optional(),
})

// Public self-service onboarding: a prospect submits a shop request that lands
// as a `pending` client row for super-admin approval. Rate-limited via
// middleware (5/hour/IP).
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parse = requestSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body", issues: parse.error.issues })
    return
  }

  const {
    slug,
    name,
    email,
    domain,
    locale,
    primary_color,
    logo_url,
    preset,
    font,
    business_model,
    niche,
    description,
  } = parse.data

  // The merchant's brand choices land directly on the pending client's
  // config/content so provisioning delivers a pre-branded boutique.
  const config: Record<string, unknown> = {}
  if (primary_color) config["primaryColor"] = primary_color
  if (logo_url) config["logoUrl"] = logo_url
  if (preset) config["preset"] = preset
  if (font) config["font"] = font
  if (business_model) config["businessModel"] = business_model
  if (locale) config["defaultLocale"] = locale
  if (niche) config["niche"] = niche
  const content: Record<string, unknown> = {}
  if (description) content["description"] = description

  try {
    await createClientRequestWorkflow(req.scope).run({
      input: {
        slug,
        name,
        contactEmail: email,
        domains: domain ? [domain] : [],
        config,
        content,
      },
    })
  } catch (error) {
    if ((error as Error).name === "DuplicateError" || (error as { type?: string }).type === "duplicate_error") {
      res.status(409).json({ error: `Slug "${slug}" is already taken` })
      return
    }
    throw error
  }

  res.status(201).json({ ok: true, slug })
}
