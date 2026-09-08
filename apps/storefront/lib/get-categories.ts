import { cache } from "react";
import { medusaClient } from "./medusa-client";

export type ProductCategory = {
  id: string;
  name: string;
  handle: string;
  parent_category_id: string | null;
};

export const getCategories = cache(async (): Promise<ProductCategory[]> => {
  try {
    const { product_categories } = await medusaClient.client.fetch<{
      product_categories: ProductCategory[];
    }>(
      "/store/product-categories?fields=id,name,handle,parent_category_id&include_descendants_tree=false",
      { method: "GET" }
    );
    return product_categories ?? [];
  } catch {
    return [];
  }
});
