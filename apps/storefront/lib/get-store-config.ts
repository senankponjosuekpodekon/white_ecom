import { cache } from "react";
import { medusaClient } from "./medusa-client";
import { presets, defaultPreset, mergeDesignConfig, DesignFullConfig } from "./design";
import type { ClientContent } from "./content";

export type StoreConfig = {
  name: string;
  primaryColor: string;
  logoUrl: string;
  font: string;
  defaultLanguage: string;
  supportedLanguages: string[];
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
  primaryColor: defaultPreset.colors.primary,
  logoUrl: "",
  font: defaultPreset.typography.body,
  defaultLanguage: "fr",
  supportedLanguages: ["fr"],
  design: defaultPreset,
  content: {},
};

export const getStoreConfig = cache(async (): Promise<StoreConfig> => {
  try {
    const config = await medusaClient.client.fetch<RawConfig>(
      "/store/store-config",
      { method: "GET" }
    );

    const design = resolveDesign(config.design);

    return {
      name: config.name ?? defaultConfig.name,
      primaryColor: config.primaryColor ?? design.colors.primary,
      logoUrl: config.logoUrl ?? defaultConfig.logoUrl,
      font: config.font ?? design.typography.body,
      defaultLanguage: config.defaultLanguage ?? defaultConfig.defaultLanguage,
      supportedLanguages:
        config.supportedLanguages ?? defaultConfig.supportedLanguages,
      design,
      content: config.content ?? defaultConfig.content,
    };
  } catch {
    return defaultConfig;
  }
});
