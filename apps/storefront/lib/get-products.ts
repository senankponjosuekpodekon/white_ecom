import { cache } from "react";
import { medusaClient } from "./medusa-client";
import type { Product } from "./types";

export const getProducts = cache(async (): Promise<Product[]> => {
  try {
    const fields = [
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
      "variants.prices.amount",
      "variants.prices.currency_code",
    ].join(",")
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>(`/store/products?limit=20&fields=${fields}`, { method: "GET" });
    return products ?? [];
  } catch {
    return [];
  }
});
