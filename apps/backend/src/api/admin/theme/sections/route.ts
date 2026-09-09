import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  loadClientContent,
  loadRawClientContent,
  saveClientContent,
} from "../../../../utils/client-config"
import type { ClientContent, MinimogSection } from "../../../../utils/default-content"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const content = loadClientContent()
  const locale = (req.query.locale as string) ?? "fr"
  const localized = content[locale as keyof ClientContent] ?? content.fr ?? content.en ?? {}
  res.json({
    minimog: localized.minimog ?? { sections: [], sectionOrder: [] },
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const body = req.body as { locale?: string; minimog: { sections?: MinimogSection[]; sectionOrder?: string[] } }
    const locale = body.locale ?? "fr"

    if (!body.minimog || !Array.isArray(body.minimog.sections)) {
      res.status(400).json({ error: "Invalid minimog.sections array" })
      return
    }

    const raw = loadRawClientContent()
    ;(raw as Record<string, unknown>)[locale] = {
      ...((raw as Record<string, unknown>)[locale] ?? {}),
      minimog: {
        sections: body.minimog.sections,
        sectionOrder: body.minimog.sectionOrder ?? body.minimog.sections.map((s) => s.id),
      },
    }
    saveClientContent(raw)

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
}
