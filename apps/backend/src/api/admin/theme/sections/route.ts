import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  loadDbContent,
  loadRawClientContent,
  resolveClientContent,
  saveClientContentDb,
} from "../../../../utils/client-config"
import { deepMerge } from "../../../../utils/merge"
import type { ClientContent, MinimogSection } from "../../../../utils/default-content"
import { requireUser } from "../../utils"

const supportedLocales = ["fr", "en"]

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) return
  const content = await resolveClientContent(req.scope)
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

    const raw = deepMerge(
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
    await saveClientContentDb(req.scope, raw as ClientContent)

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: "Failed to save theme sections" })
  }
}
