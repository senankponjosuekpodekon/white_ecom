import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { loadClientConfig, loadClientContent } from "../../../utils/client-config"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fileConfig = loadClientConfig()
  const content = loadClientContent()

  const {
    STORE_NAME,
    PRIMARY_COLOR,
    LOGO_URL,
    STORE_FONT,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    DESIGN_PRESET,
    SITE_URL,
  } = process.env

  const design = (fileConfig.design as Record<string, unknown>) ?? {}
  const resolvedDesign = {
    preset: (design.preset as string) ?? DESIGN_PRESET ?? "modern",
    ...design,
  }

  if (SITE_URL) {
    if (content.fr && !content.fr.siteUrl) {
      content.fr.siteUrl = SITE_URL
    }
    if (content.en && !content.en.siteUrl) {
      content.en.siteUrl = SITE_URL
    }
  }

  res.json({
    name: (fileConfig.name as string) ?? STORE_NAME ?? "White Shop",
    primaryColor: (fileConfig.primaryColor as string) ?? PRIMARY_COLOR ?? "#111111",
    logoUrl: (fileConfig.logoUrl as string) ?? LOGO_URL ?? "",
    font: (fileConfig.font as string) ?? STORE_FONT ?? "Inter",
    defaultLanguage: (fileConfig.defaultLanguage as string) ?? DEFAULT_LANGUAGE ?? "fr",
    supportedLanguages:
      (fileConfig.supportedLanguages as string[]) ??
      SUPPORTED_LANGUAGES?.split(",") ??
      ["fr"],
    design: resolvedDesign,
    content,
  })
}
