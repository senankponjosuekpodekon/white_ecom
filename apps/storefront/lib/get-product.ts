import { cache } from "react";
import { medusaClient } from "./medusa-client";
import { getStoreConfig } from "./get-store-config";
import { getRegionId } from "./regions";
import { productFields, normalizePrices } from "./get-products";
import type { Product } from "./types";

export const getProduct = cache(async (handle: string): Promise<Product | null> => {
  try {
    const config = await getStoreConfig();
    const regionId = await getRegionId(config);
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>(
      `/store/products?handle=${encodeURIComponent(handle)}&limit=1&fields=${productFields}${regionId ? `&region_id=${regionId}` : ""}`,
      {
        method: "GET",
      }
    );
    normalizePrices(products ?? []);
    return products?.[0] ?? null;
  } catch {
    return null;
  }
});
