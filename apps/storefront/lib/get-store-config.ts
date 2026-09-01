import { cache } from "react";

export type StoreConfig = {
  name: string;
  primaryColor: string;
  logoUrl: string;
  font: string;
  defaultLanguage: string;
  supportedLanguages: string[];
};

export const getStoreConfig = cache(async (): Promise<StoreConfig> => {
  // TODO: wire to Medusa backend once it is reachable
  // const { store } = await medusaClient.store.retrieve()

  return {
    name: "White Shop",
    primaryColor: "#111111",
    logoUrl: "",
    font: "Inter",
    defaultLanguage: "fr",
    supportedLanguages: ["fr"],
  };
});
