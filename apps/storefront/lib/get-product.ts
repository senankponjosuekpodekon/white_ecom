import { cache } from "react";
import { medusaClient } from "./medusa-client";
import type { Product } from "./types";

export const getProduct = cache(async (handle: string): Promise<Product | null> => {
  try {
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>(`/store/products?handle=${encodeURIComponent(handle)}&limit=1`, {
      method: "GET",
    });
    return products?.[0] ?? null;
  } catch {
    return null;
  }
});
