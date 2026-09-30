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
  async (
    limit: number,
    categoryId?: string,
    offset = 0,
    order?: string
  ): Promise<Product[]> => {
    const params = new URLSearchParams({ limit: String(limit), fields });
    if (offset > 0) params.set("offset", String(offset));
    if (categoryId) params.append("category_id[]", categoryId);
    if (order) params.set("order", order);
    const { products } = await medusaClient.client.fetch<{
      products: Product[];
    }>(`/store/products?${params.toString()}`, { method: "GET" });
    return products ?? [];
  },
  ["products"],
  { revalidate: 60, tags: ["products"] }
);

export const getProducts = async (
  limit = 20,
  categoryId?: string,
  offset = 0,
  order?: string
): Promise<Product[]> => {
  try {
    return await fetchProducts(limit, categoryId, offset, order);
  } catch (err) {
    console.error("[getProducts] Failed to load products:", err);
    return [];
  }
};
