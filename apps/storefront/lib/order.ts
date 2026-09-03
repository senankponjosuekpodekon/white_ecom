import { medusaClient } from "./medusa-client";
import { ProductVariant } from "./types";

export type OrderItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  variant: ProductVariant;
};

export type Order = {
  id: string;
  status: string;
  total: number;
  currency_code: string;
  items: OrderItem[];
};

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const order = await medusaClient.client.fetch<Order>(`/store/orders/${id}`, {
      method: "GET",
    });
    return order ?? null;
  } catch {
    return null;
  }
}
