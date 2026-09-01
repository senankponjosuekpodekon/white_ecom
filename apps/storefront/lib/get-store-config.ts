import { cache } from "react";
import { medusaClient } from "./medusa-client";

export type StoreConfig = {
  name: string;
  primaryColor: string;
  logoUrl: string;
  font: string;
  defaultLanguage: string;
  supportedLanguages: string[];
};

const defaultConfig: StoreConfig = {
  name: "White Shop",
  primaryColor: "#111111",
  logoUrl: "",
  font: "Inter",
  defaultLanguage: "fr",
  supportedLanguages: ["fr"],
};

export const getStoreConfig = cache(async (): Promise<StoreConfig> => {
  try {
    const config = await medusaClient.client.fetch<StoreConfig>(
      "/store/store-config",
      { method: "GET" }
    );

    return {
      name: config.name ?? defaultConfig.name,
      primaryColor: config.primaryColor ?? defaultConfig.primaryColor,
      logoUrl: config.logoUrl ?? defaultConfig.logoUrl,
      font: config.font ?? defaultConfig.font,
      defaultLanguage: config.defaultLanguage ?? defaultConfig.defaultLanguage,
      supportedLanguages:
        config.supportedLanguages ?? defaultConfig.supportedLanguages,
    };
  } catch {
    return defaultConfig;
  }
});
