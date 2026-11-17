import { cache } from "react";
import { medusaClient } from "./medusa-client";
import { getStoreConfig } from "./get-store-config";
import { getRegionId } from "./regions";
import type { Product, ProductVariant } from "./types";

// Medusa v2 no longer resolves variants.prices on the store API; prices are
// computed per region via variants.calculated_price, which requires
// region_id/currency_code query params. Normalize back onto `prices`.
type ApiVariant = ProductVariant & {
  calculated_price?: {
    calculated_amount?: number;
    currency_code?: string;
  } | null;
};

export function normalizePrices(products: Array<{ variants: ApiVariant[] }>): void {
  for (const product of products) {
    for (const variant of product.variants) {
      const calc = variant.calculated_price;
      if (
        calc?.calculated_amount != null &&
        calc.currency_code &&
        (!variant.prices || variant.prices.length === 0)
      ) {
        variant.prices = [
          { amount: calc.calculated_amount, currency_code: calc.currency_code },
        ];
      }
    }
  }
}

export const productFields = [
  "id",
  "title",
  "description",
  "handle",
  "thumbnail",
  "status",
  "variants.id",
  "variants.title",
  "variants.sku",
  "variants.inventory_quantity",
  "variants.calculated_price.calculated_amount",
  "variants.calculated_price.currency_code",
].join(",")

export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const config = await getStoreConfig();
    const regionId = await getRegionId(config);
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>(
      `/store/products?limit=20&fields=${productFields}${regionId ? `&region_id=${regionId}` : ""}`,
      { method: "GET" }
    );
    normalizePrices(products ?? []);
    return products ?? [];
  } catch {
    return [];
  }
});
