import { cache } from "react";
import { medusaClient } from "./medusa-client";

export type ProductCategory = {
  id: string;
  name: string;
  handle: string;
  parent_category_id: string | null;
};

export const getCategories = cache(
  async (locale?: string): Promise<ProductCategory[]> => {
    try {
      const params = new URLSearchParams({
        fields: "id,name,handle,parent_category_id",
        include_descendants_tree: "false",
      });
      if (locale) params.set("locale", locale);
      const { product_categories } = await medusaClient.client.fetch<{
        product_categories: ProductCategory[];
      }>(`/store/product-categories?${params.toString()}`, { method: "GET" });
      return product_categories ?? [];
    } catch {
      return [];
    }
  }
);
