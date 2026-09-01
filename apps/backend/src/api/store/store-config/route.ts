import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const {
    STORE_NAME,
    PRIMARY_COLOR,
    LOGO_URL,
    STORE_FONT,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
  } = process.env;

  res.json({
    name: STORE_NAME ?? "White Shop",
    primaryColor: PRIMARY_COLOR ?? "#111111",
    logoUrl: LOGO_URL ?? "",
    font: STORE_FONT ?? "Inter",
    defaultLanguage: DEFAULT_LANGUAGE ?? "fr",
    supportedLanguages: SUPPORTED_LANGUAGES?.split(",") ?? ["fr"],
  });
}
