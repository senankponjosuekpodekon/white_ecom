import { unstable_cache } from "next/cache";
import { medusaClient } from "./medusa-client";
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
  "variants.prices.amount",
  "variants.prices.currency_code",
].join(",");

const fetchProduct = unstable_cache(
  async (handle: string): Promise<Product | null> => {
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>(
      `/store/products?handle=${encodeURIComponent(handle)}&limit=1&fields=${fields}`,
      { method: "GET" }
    );
    return products?.[0] ?? null;
  },
  ["product"],
  { revalidate: 60, tags: ["product"] }
);

export const getProduct = async (handle: string): Promise<Product | null> => {
  try {
    return await fetchProduct(handle);
  } catch (err) {
    console.error(`[getProduct] Failed to load product ${handle}:`, err);
    return null;
  }
};
