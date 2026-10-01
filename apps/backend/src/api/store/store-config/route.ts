import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  resolveClientConfig,
  resolveClientContent,
} from "../../../utils/client-config"
import { resolveRequestClient } from "../../../utils/client-resolver"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const client = await resolveRequestClient(req)
  const fileConfig = await resolveClientConfig(req.scope, client)
  const content = await resolveClientContent(req.scope, client)

  const {
    STORE_NAME,
    PRIMARY_COLOR,
    LOGO_URL,
    STORE_FONT,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    DESIGN_PRESET,
    SITE_URL,
    BUSINESS_MODEL,
    DEFAULT_CURRENCY,
    CURRENCIES,
    DEFAULT_COUNTRY,
    DEFAULT_REGION,
  } = process.env

  const design = (fileConfig.design as Record<string, unknown>) ?? {}
  const designColors = (design.colors as Record<string, string>) ?? {}
  const designTypography = (design.typography as Record<string, string>) ?? {}

  const resolvedDesign = {
    ...design,
    preset:
      (design.preset as string) ??
      (fileConfig.designPreset as string) ??
      DESIGN_PRESET ??
      "modern",
    colors: {
      ...designColors,
      primary:
        designColors.primary ??
        (fileConfig.primaryColor as string) ??
        PRIMARY_COLOR ??
        "#111111",
    },
    typography: {
      ...designTypography,
      heading:
        designTypography.heading ??
        (fileConfig.font as string) ??
        STORE_FONT ??
        "Inter",
      body:
        designTypography.body ??
        (fileConfig.font as string) ??
        STORE_FONT ??
        "Inter",
    },
  }

  const siteUrl =
    (fileConfig.siteUrl as string) ??
    SITE_URL ??
    "http://localhost:8080"

  res.json({
    name: (fileConfig.name as string) ?? STORE_NAME ?? "White Shop",
    siteUrl,
    primaryColor: (fileConfig.primaryColor as string) ?? PRIMARY_COLOR ?? "#111111",
    logoUrl: (fileConfig.logoUrl as string) ?? LOGO_URL ?? "",
    font: (fileConfig.font as string) ?? STORE_FONT ?? "Inter",
    defaultLanguage: (fileConfig.defaultLanguage as string) ?? DEFAULT_LANGUAGE ?? "fr",
    supportedLanguages:
      (fileConfig.supportedLanguages as string[]) ??
      SUPPORTED_LANGUAGES?.split(",") ??
      ["fr"],
    businessModel: (fileConfig.businessModel as string) ?? BUSINESS_MODEL ?? "classic",
    defaultCurrency: (fileConfig.defaultCurrency as string) ?? DEFAULT_CURRENCY ?? "eur",
    currencies:
      (fileConfig.currencies as string[]) ??
      CURRENCIES?.split(",") ??
      ["eur"],
    defaultCountry: (fileConfig.defaultCountry as string) ?? DEFAULT_COUNTRY ?? "FR",
    defaultRegion: (fileConfig.defaultRegion as string) ?? DEFAULT_REGION ?? "EU",
    whatsapp:
      (fileConfig.whatsapp as Record<string, unknown>) ?? {
        enabled: process.env.WHATSAPP_ENABLED === "true",
        number: process.env.WHATSAPP_NUMBER ?? "",
      },
    design: resolvedDesign,
    content,
  })
}
