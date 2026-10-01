import { unstable_cache } from "next/cache";
import { medusaClient } from "./medusa-client";
import type { Product } from "./types";

export const PRODUCT_FIELDS = [
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
  locale?: string;
};

const fetchProductsPage = unstable_cache(
  async ({
    limit,
    offset = 0,
    categoryId,
    order,
    q,
    locale,
  }: ProductQuery): Promise<{ products: Product[]; count: number }> => {
    const params = new URLSearchParams({ limit: String(limit), fields: PRODUCT_FIELDS });
    if (offset > 0) params.set("offset", String(offset));
    if (categoryId) params.append("category_id[]", categoryId);
    if (order) params.set("order", order);
    if (q) params.set("q", q);
    if (locale) params.set("locale", locale);
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

type CatalogQuery = ProductQuery & {
  minPrice?: number | null;
  maxPrice?: number | null;
  inStock?: boolean;
};

// Server-side catalogue endpoint: supports price/stock filtering and price
// ordering, which the default /store/products API cannot do.
const fetchCatalogPage = unstable_cache(
  async ({
    limit,
    offset = 0,
    categoryId,
    order,
    q,
    locale,
    minPrice,
    maxPrice,
    inStock,
  }: CatalogQuery): Promise<{ products: Product[]; count: number }> => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (offset > 0) params.set("offset", String(offset));
    if (categoryId) params.append("category_id[]", categoryId);
    if (order) params.set("order", order);
    if (q) params.set("q", q);
    if (locale) params.set("locale", locale);
    if (minPrice != null) params.set("min_price", String(minPrice));
    if (maxPrice != null) params.set("max_price", String(maxPrice));
    if (inStock) params.set("in_stock", "true");
    const data = await medusaClient.client.fetch<{
      products: Product[];
      count?: number;
    }>(`/store/catalog?${params.toString()}`, { method: "GET" });
    return {
      products: (data.products ?? []).map(normalizeProductPrices),
      count: data.count ?? (data.products ?? []).length,
    };
  },
  ["catalog"],
  { revalidate: 60, tags: ["products"] }
);

// Semantic search over product embeddings (if an AI provider is configured on
// the backend). Returns null when semantic search is unavailable.
export async function semanticSearch(
  q: string,
  locale?: string
): Promise<Product[] | null> {
  try {
    const params = new URLSearchParams({ q });
    if (locale) params.set("locale", locale);
    const data = await medusaClient.client.fetch<{
      products: Product[];
      semantic: boolean;
    }>(`/store/search?${params.toString()}`, { method: "GET" });
    if (!data.semantic) return null;
    return (data.products ?? []).map(normalizeProductPrices);
  } catch {
    return null;
  }
}

export const getCatalogPage = async (
  query: CatalogQuery
): Promise<{ products: Product[]; count: number }> => {
  try {
    return await fetchCatalogPage(query);
  } catch (err) {
    console.error("[getCatalog] Failed to load products:", err);
    return { products: [], count: 0 };
  }
};

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
  q?: string,
  locale?: string
): Promise<Product[]> => {
  const { products } = await getProductsPage({
    limit,
    offset,
    categoryId,
    order,
    q,
    locale,
  });
  return products;
};
