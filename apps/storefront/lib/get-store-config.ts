import { cache } from "react";
import { unstable_cache } from "next/cache";
import { medusaClient } from "./medusa-client";
import { presets, defaultPreset, mergeDesignConfig, DesignFullConfig } from "./design";
import type { ClientContent } from "./content";

export type StoreConfig = {
  name: string;
  siteUrl: string;
  primaryColor: string;
  logoUrl: string;
  font: string;
  defaultLanguage: string;
  supportedLanguages: string[];
  businessModel: string;
  defaultCurrency: string;
  currencies: string[];
  defaultCountry: string;
  defaultRegion: string;
  whatsapp?: {
    enabled?: boolean;
    number?: string;
    message?: string;
  };
  design: DesignFullConfig;
  content: ClientContent;
};

type RawConfig = Partial<StoreConfig> & {
  design?: {
    preset?: string;
    [key: string]: unknown;
  };
};

function resolveDesign(raw?: RawConfig["design"]): DesignFullConfig {
  const presetName = raw?.preset ?? "modern";
  const base = presets[presetName] ?? defaultPreset;
  return mergeDesignConfig(base, raw as Parameters<typeof mergeDesignConfig>[1]);
}

const defaultConfig: StoreConfig = {
  name: "White Shop",
  siteUrl: "http://localhost:8080",
  primaryColor: defaultPreset.colors.primary,
  logoUrl: "",
  font: defaultPreset.typography.body,
  defaultLanguage: "fr",
  supportedLanguages: ["fr"],
  businessModel: "classic",
  defaultCurrency: "eur",
  currencies: ["eur"],
  defaultCountry: "FR",
  defaultRegion: "EU",
  design: defaultPreset,
  content: {},
};

const fetchStoreConfig = unstable_cache(
  async (): Promise<RawConfig> => {
    const config = await medusaClient.client.fetch<RawConfig>(
      "/store/store-config",
      { method: "GET" }
    );
    return config;
  },
  ["store-config"],
  { revalidate: 60, tags: ["store-config"] }
);

export const getStoreConfig = cache(async (): Promise<StoreConfig> => {
  try {
    const config = await fetchStoreConfig();
    const design = resolveDesign(config.design);

    return {
      name: config.name ?? defaultConfig.name,
      siteUrl: config.siteUrl ?? defaultConfig.siteUrl,
      primaryColor: config.primaryColor ?? design.colors.primary,
      logoUrl: config.logoUrl ?? defaultConfig.logoUrl,
      font: config.font ?? design.typography.body,
      defaultLanguage: config.defaultLanguage ?? defaultConfig.defaultLanguage,
      supportedLanguages:
        config.supportedLanguages ?? defaultConfig.supportedLanguages,
      businessModel: config.businessModel ?? defaultConfig.businessModel,
      defaultCurrency: config.defaultCurrency ?? defaultConfig.defaultCurrency,
      currencies: config.currencies ?? defaultConfig.currencies,
      defaultCountry: config.defaultCountry ?? defaultConfig.defaultCountry,
      defaultRegion: config.defaultRegion ?? defaultConfig.defaultRegion,
      whatsapp: config.whatsapp,
      design,
      content: config.content ?? defaultConfig.content,
    };
  } catch (err) {
    console.error("[getStoreConfig] Failed to load store config:", err);
    return defaultConfig;
  }
});
