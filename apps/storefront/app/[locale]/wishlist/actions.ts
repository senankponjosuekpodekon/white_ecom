"use server";

import { medusaClient } from "@/lib/medusa-client";
import { normalizeProductPrices, PRODUCT_FIELDS } from "@/lib/get-products";
import type { Product } from "@/lib/types";

export async function getWishlistProducts(
  ids: string[],
  locale?: string
): Promise<Product[]> {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const safeIds = ids.slice(0, 100);

  const params = new URLSearchParams({ fields: PRODUCT_FIELDS });
  for (const id of safeIds) params.append("id[]", id);
  if (locale) params.set("locale", locale);

  try {
    const data = await medusaClient.client.fetch<{ products: Product[] }>(
      `/store/products?${params.toString()}`,
      { method: "GET" }
    );
    return (data.products ?? []).map(normalizeProductPrices);
  } catch (err) {
    console.error("[wishlist] Failed to load products:", err);
    return [];
  }
}
