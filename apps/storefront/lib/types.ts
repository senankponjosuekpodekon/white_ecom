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
  calculated_price?: {
    calculated_amount: number;
    currency_code: string;
    original_amount?: number;
  } | null;
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  categories?: Array<{ id: string }>;
  variants: ProductVariant[];
};

export type CartLineItem = {
  id: string;
  title: string;
  quantity: number;
  variant: ProductVariant;
  product?: {
    title: string;
    thumbnail?: string | null;
  };
  unit_price: number;
};

export type CartAddress = {
  first_name?: string | null;
  last_name?: string | null;
  address_1?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
};

export type CartShippingMethod = {
  id: string;
  name?: string | null;
  amount?: number;
};

export type CartPromotion = {
  id: string;
  code?: string;
};

export type Cart = {
  id: string;
  currency_code: string;
  items: CartLineItem[];
  total: number;
  subtotal?: number;
  discount_total?: number;
  promotions?: CartPromotion[];
  email?: string | null;
  shipping_address?: CartAddress | null;
  billing_address?: CartAddress | null;
  shipping_methods?: CartShippingMethod[];
};
