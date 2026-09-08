import { cache } from "react";
import { medusaClient } from "./medusa-client";
import type { Product } from "./types";

export const getProduct = cache(async (handle: string): Promise<Product | null> => {
  try {
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
    ].join(",")
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>(
      `/store/products?handle=${encodeURIComponent(handle)}&limit=1&fields=${fields}`,
      {
        method: "GET",
      }
    );
    return products?.[0] ?? null;
  } catch {
    return null;
  }
});
