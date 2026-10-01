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
  "variants.calculated_price.*",
].join(",");

// The store API exposes region-aware prices via `calculated_price`, not the
// raw `prices` relation — normalize so components can keep using `prices[0]`.
export function normalizeProductPrices(product: Product): Product {
  for (const variant of product.variants ?? []) {
    const cp = variant.calculated_price;
    if (cp && !variant.prices?.length) {
      variant.prices = [
        { amount: cp.calculated_amount, currency_code: cp.currency_code },
      ];
    }
  }
  return product;
}

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
      products: (data.products ?? []).map(normalizeProductPrices),
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
