import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  loadDbContent,
  loadRawClientContent,
  resolveClientContent,
  saveClientContentDb,
} from "../../../../utils/client-config"
import { deepMerge } from "../../../../utils/merge"
import type { ClientContent, MinimogSection } from "../../../../utils/default-content"
import { requireUser, tenantClient } from "../../utils"
import { updateClientWorkflow } from "../../../../workflows/update-client"

const supportedLocales = ["fr", "en"]

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) return
  const client = await tenantClient(req)
  const content = await resolveClientContent(req.scope, client)
  const locale = supportedLocales.includes(req.query.locale as string)
    ? (req.query.locale as string)
    : "fr"
  const localized = content[locale as keyof ClientContent] ?? content.fr ?? content.en ?? {}
  res.json({
    minimog: localized.minimog ?? { sections: [], sectionOrder: [] },
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) return
  try {
    const body = req.body as { locale?: string; minimog: { sections?: MinimogSection[]; sectionOrder?: string[] } }
    const locale = supportedLocales.includes(body.locale as string) ? (body.locale as string) : "fr"

    if (!body.minimog || !Array.isArray(body.minimog.sections)) {
      res.status(400).json({ error: "Invalid minimog.sections array" })
      return
    }

    const client = await tenantClient(req)
    // Tenant scope: start from the tenant's stored content; platform scope:
    // legacy file + store-metadata layers.
    const raw = client
      ? ((client.content ?? {}) as Record<string, unknown>)
      : deepMerge(
          loadRawClientContent() as Record<string, unknown>,
          (await loadDbContent(req.scope)) as Record<string, unknown>
        )
    ;(raw as Record<string, unknown>)[locale] = {
      ...((raw as Record<string, unknown>)[locale] ?? {}),
      minimog: {
        sections: body.minimog.sections,
        sectionOrder: body.minimog.sectionOrder ?? body.minimog.sections.map((s) => s.id),
      },
    }
    if (client) {
      await updateClientWorkflow(req.scope).run({
        input: { id: client.id, content: raw },
      })
    } else {
      await saveClientContentDb(req.scope, raw as ClientContent)
    }

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: "Failed to save theme sections" })
  }
}
