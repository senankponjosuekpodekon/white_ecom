import { cache } from "react";
import { medusaClient } from "./medusa-client";
import type { Product } from "./types";

export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>("/store/products?limit=20", { method: "GET" });
    return products ?? [];
  } catch {
    return [];
  }
});
