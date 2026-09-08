export type ProductVariant = {
  id: string;
  title: string;
  sku?: string | null;
  manage_inventory?: boolean;
  inventory_quantity?: number | null;
  prices?: Array<{
    amount: number;
    currency_code: string;
  }>;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  variants: ProductVariant[];
};

export type CartLineItem = {
  id: string;
  title: string;
  quantity: number;
  variant: ProductVariant;
  unit_price: number;
};

export type Cart = {
  id: string;
  currency_code: string;
  items: CartLineItem[];
  total: number;
};
