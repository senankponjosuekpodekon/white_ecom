import fs from "fs";
import path from "path";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

function loadClientConfig() {
  const clientName = process.env.CLIENT_NAME;
  if (!clientName) {
    return {};
  }

  const configPath = path.resolve(
    process.cwd(),
    "clients",
    clientName,
    "config.json"
  );

  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fileConfig = loadClientConfig();
  const {
    STORE_NAME,
    PRIMARY_COLOR,
    LOGO_URL,
    STORE_FONT,
    DEFAULT_LANGUAGE,
    SUPPORTED_LANGUAGES,
    DESIGN_PRESET,
  } = process.env;

  const design = fileConfig.design ?? {};
  const resolvedDesign = {
    preset: design.preset ?? DESIGN_PRESET ?? "modern",
    ...design,
  };

  res.json({
    name: fileConfig.name ?? STORE_NAME ?? "White Shop",
    primaryColor: fileConfig.primaryColor ?? PRIMARY_COLOR ?? "#111111",
    logoUrl: fileConfig.logoUrl ?? LOGO_URL ?? "",
    font: fileConfig.font ?? STORE_FONT ?? "Inter",
    defaultLanguage: fileConfig.defaultLanguage ?? DEFAULT_LANGUAGE ?? "fr",
    supportedLanguages:
      fileConfig.supportedLanguages ??
      SUPPORTED_LANGUAGES?.split(",") ?? ["fr"],
    design: resolvedDesign,
  });
}
