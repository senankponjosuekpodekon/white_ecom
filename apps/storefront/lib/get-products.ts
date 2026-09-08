import { cache } from "react";
import { medusaClient } from "./medusa-client";
import type { Product } from "./types";

export const getProducts = cache(
  async (limit = 20, categoryId?: string): Promise<Product[]> => {
  try {
    const fields = [
      "id",
      "title",
      "description",
      "handle",
      "thumbnail",
      "status",
      "created_at",
      "variants.id",
      "variants.title",
      "variants.sku",
      "variants.manage_inventory",
      "variants.inventory_quantity",
      "variants.prices.amount",
      "variants.prices.currency_code",
    ].join(",")
    const category = categoryId ? `&category_id[]=${encodeURIComponent(categoryId)}` : ""
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>(`/store/products?limit=${limit}&fields=${fields}${category}`, { method: "GET" });
    return products ?? [];
  } catch {
    return [];
  }
});
