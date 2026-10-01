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

  const { slug, name, email, domain } = parse.data

  try {
    await createClientRequestWorkflow(req.scope).run({
      input: {
        slug,
        name,
        contactEmail: email,
        domains: domain ? [domain] : [],
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
