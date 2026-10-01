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

type ProductQuery = {
  limit: number;
  offset?: number;
  categoryId?: string;
  order?: string;
  q?: string;
};

const fetchProductsPage = unstable_cache(
  async ({
    limit,
    offset = 0,
    categoryId,
    order,
    q,
  }: ProductQuery): Promise<{ products: Product[]; count: number }> => {
    const params = new URLSearchParams({ limit: String(limit), fields });
    if (offset > 0) params.set("offset", String(offset));
    if (categoryId) params.append("category_id[]", categoryId);
    if (order) params.set("order", order);
    if (q) params.set("q", q);
    const data = await medusaClient.client.fetch<{
      products: Product[];
      count?: number;
    }>(`/store/products?${params.toString()}`, { method: "GET" });
    return {
      products: data.products ?? [],
      count: data.count ?? (data.products ?? []).length,
    };
  },
  ["products"],
  { revalidate: 60, tags: ["products"] }
);

export const getProductsPage = async (
  query: ProductQuery
): Promise<{ products: Product[]; count: number }> => {
  try {
    return await fetchProductsPage(query);
  } catch (err) {
    console.error("[getProducts] Failed to load products:", err);
    return { products: [], count: 0 };
  }
};

export const getProducts = async (
  limit = 20,
  categoryId?: string,
  offset = 0,
  order?: string,
  q?: string
): Promise<Product[]> => {
  const { products } = await getProductsPage({
    limit,
    offset,
    categoryId,
    order,
    q,
  });
  return products;
};
