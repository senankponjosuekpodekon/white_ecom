export type ProductVariant = {
  id: string;
  title: string;
  sku?: string | null;
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
  variants: ProductVariant[];
};

export type CartLineItem = {
  id: string;
  title: string;
  quantity: number;
  variant_id?: string;
  product_title?: string;
  subtitle?: string;
  variant: ProductVariant;
  unit_price: number;
};

export type CartAddress = {
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  postal_code?: string;
  city?: string;
  country_code?: string;
  phone?: string;
};

export type Cart = {
  id: string;
  currency_code: string;
  email?: string | null;
  items: CartLineItem[];
  total: number;
  shipping_address?: CartAddress | null;
  billing_address?: CartAddress | null;
};
