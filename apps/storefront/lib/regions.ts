import { medusaClient } from "./medusa-client";

export type Region = {
  id: string;
  currency_code: string;
  countries?: Array<{ iso_2: string }>;
};

export async function getRegionId(config: {
  defaultCurrency: string;
  defaultCountry: string;
}): Promise<string | undefined> {
  try {
    const { regions } = await medusaClient.client.fetch<{
      regions: Region[];
    }>("/store/regions?limit=100&fields=id,currency_code,countries.iso_2");

    const currency = config.defaultCurrency?.toLowerCase();
    const country = config.defaultCountry?.toLowerCase();
    const currencyMatches = (regions ?? []).filter(
      (r) => r.currency_code?.toLowerCase() === currency
    );

    return (
      currencyMatches.find((r) =>
        r.countries?.some((c) => c.iso_2?.toLowerCase() === country)
      ) ?? currencyMatches[0]
    )?.id;
  } catch {
    return undefined;
  }
}
