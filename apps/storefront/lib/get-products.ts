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
  "created_at",
  "categories.id",
  "variants.id",
  "variants.title",
  "variants.sku",
  "variants.manage_inventory",
  "variants.inventory_quantity",
  "variants.prices.amount",
  "variants.prices.currency_code",
].join(",");

const fetchProducts = unstable_cache(
  async (limit: number, categoryId?: string): Promise<Product[]> => {
    const category = categoryId ? `&category_id[]=${encodeURIComponent(categoryId)}` : "";
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>(`/store/products?limit=${limit}&fields=${fields}${category}`, { method: "GET" });
    return products ?? [];
  },
  ["products"],
  { revalidate: 60, tags: ["products"] }
);

export const getProducts = async (
  limit = 20,
  categoryId?: string
): Promise<Product[]> => {
  try {
    return await fetchProducts(limit, categoryId);
  } catch (err) {
    console.error("[getProducts] Failed to load products:", err);
    return [];
  }
};
