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
    const { store } = await medusaClient.client.fetch<{
      store: Record<string, unknown>;
    }>("/store/store", {
      method: "GET",
      query: {
        fields: "name,metadata",
      },
    });

    const metadata = (store.metadata ?? {}) as Record<string, unknown>;

    return {
      name: (store.name as string) ?? defaultConfig.name,
      primaryColor: (metadata.primary_color as string) ?? defaultConfig.primaryColor,
      logoUrl: (metadata.logo_url as string) ?? defaultConfig.logoUrl,
      font: (metadata.font as string) ?? defaultConfig.font,
      defaultLanguage: (metadata.default_language as string) ?? defaultConfig.defaultLanguage,
      supportedLanguages: (metadata.supported_languages as string[]) ?? defaultConfig.supportedLanguages,
    };
  } catch {
    return defaultConfig;
  }
});
