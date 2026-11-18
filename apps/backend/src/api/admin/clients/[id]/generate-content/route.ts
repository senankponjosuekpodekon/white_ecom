import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CLIENT_MODULE } from "../../../../../modules/client"
import type ClientModuleService from "../../../../../modules/client/service"
import type { ClientRecord } from "../../../../../utils/client-resolver"
import { requireSuperAdmin } from "../../../utils"
import { generateClientContentWorkflow } from "../../../../../workflows/generate-client-content"
import { resolveProvider } from "../../../../../utils/ai"

const schema = z.object({
  locales: z.array(z.string().min(2).max(5)).optional(),
})

// POST /admin/clients/:id/generate-content
// Regenerates the tenant's storefront copy (hero, about, SEO, legal pages)
// per locale via the configured AI provider and writes it into
// client.content. No-op 503 when no AI provider is configured.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  if (resolveProvider() === "none") {
    res.status(503).json({
      error: "No AI provider configured (OPENAI_API_KEY, Cloudflare or Ollama)",
    })
    return
  }

  const parse = schema.safeParse(req.body ?? {})
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }

  const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)
  const clients = (await service.listClients(
    { id: req.params.id },
    {}
  )) as unknown as ClientRecord[]
  if (!clients[0]) {
    res.status(404).json({ error: "Client not found" })
    return
  }

  const { result } = await generateClientContentWorkflow(req.scope).run({
    input: { clientId: clients[0].id, locales: parse.data.locales },
  })

  res.json({ success: true, written: result.written })
}
