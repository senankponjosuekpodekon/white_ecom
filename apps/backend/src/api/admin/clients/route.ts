import fs from "fs"
import path from "path"
import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { defaultContent } from "../../../utils/default-content"
import { requireSuperAdmin, isValidClientName } from "../utils"

const clientsDir = path.resolve(process.cwd(), "clients")

const createSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine(isValidClientName, {
      message: "Client name must contain only lowercase letters, digits and dashes",
    }),
})

const defaultConfig = {
  name: "White Shop",
  primaryColor: "#3B82F6",
  logoUrl: "",
  font: "Inter",
  defaultLanguage: "fr",
  supportedLanguages: ["fr"],
  designPreset: "modern",
  siteUrl: "",
  businessModel: "classic",
  defaultCurrency: "eur",
  currencies: ["eur"],
  defaultCountry: "FR",
  defaultRegion: "EU",
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  try {
    const current = process.env.CLIENT_NAME ?? "default"
    const dirs = fs
      .readdirSync(clientsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)

    res.json({ current, clients: dirs })
  } catch {
    res.json({ current: process.env.CLIENT_NAME ?? "default", clients: [] })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  const parse = createSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }

  const { name } = parse.data
  const clientDir = path.join(clientsDir, name)

  try {
    fs.mkdirSync(clientDir, { recursive: true })
    fs.writeFileSync(
      path.join(clientDir, "config.json"),
      JSON.stringify(defaultConfig, null, 2)
    )
    fs.writeFileSync(
      path.join(clientDir, "content.json"),
      JSON.stringify(defaultContent, null, 2)
    )
    res.json({ success: true, name })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
