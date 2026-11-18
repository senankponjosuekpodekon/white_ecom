import { unstable_cache } from "next/cache";
import { medusaClient } from "./medusa-client";
import { normalizeProductPrices } from "./get-products";
import { getStoreConfig } from "./get-store-config";
import { getRegionId } from "./regions";
import type { Product } from "./types";

const fields = [
  "id",
  "title",
  "description",
  "handle",
  "thumbnail",
  "status",
  "metadata",
  "variants.id",
  "variants.title",
  "variants.sku",
  "variants.inventory_quantity",
  "variants.calculated_price.*",
].join(",");

const fetchProduct = unstable_cache(
  async (handle: string, locale?: string): Promise<Product | null> => {
    const params = new URLSearchParams({ handle, limit: "1", fields });
    if (locale) params.set("locale", locale);
    const regionId = await getRegionId(await getStoreConfig());
    if (regionId) params.set("region_id", regionId);
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>(`/store/products?${params.toString()}`, { method: "GET" });
    const product = products?.[0];
    return product ? normalizeProductPrices(product) : null;
  },
  ["product"],
  { revalidate: 60, tags: ["product"] }
);

export const getProduct = async (
  handle: string,
  locale?: string
): Promise<Product | null> => {
  try {
    return await fetchProduct(handle, locale);
  } catch (err) {
    console.error(`[getProduct] Failed to load product ${handle}:`, err);
    return null;
  }
};
