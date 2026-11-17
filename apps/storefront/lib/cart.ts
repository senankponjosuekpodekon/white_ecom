import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { medusaClient } from "./medusa-client";
import { getStoreConfig } from "./get-store-config";
import { getRegionId } from "./regions";
import type { Cart } from "./types";

const CART_COOKIE = "cartId";

async function getCartCookie() {
  return (await cookies()).get(CART_COOKIE)?.value;
}

export async function getCart(): Promise<Cart | null> {
  const cartId = await getCartCookie();
  if (!cartId) {
    return null;
  }

  try {
    const fields = [
      "total",
      "currency_code",
      "email",
      "items.*",
      "items.variant_id",
      "items.product_title",
      "items.subtitle",
      "items.product.title",
      "items.product.thumbnail",
      "shipping_address.*",
      "billing_address.*",
    ].join(",")
    const { cart } = await medusaClient.client.fetch<{ cart: Cart }>(
      `/store/carts/${cartId}?fields=${fields}`,
      { method: "GET" }
    );
    // Medusa v2 cart line items don't expose a nested variant object;
    // callers expect item.variant.{id,title,sku}.
    for (const item of cart?.items ?? []) {
      if (!item.variant) {
        item.variant = {
          id: item.variant_id ?? item.id,
          title: item.subtitle ?? item.product_title ?? item.title,
        };
      }
    }
    return cart ?? null;
  } catch {
    return null;
  }
}

export async function createCart(): Promise<Cart> {
  const config = await getStoreConfig();
  const regionId = await getRegionId(config);
  const { cart } = await medusaClient.client.fetch<{ cart: Cart }>(
    "/store/carts",
    {
      method: "POST",
      body: {
        currency_code: config.defaultCurrency,
        ...(regionId ? { region_id: regionId } : {}),
      },
    }
  );

  const cookieStore = await cookies()
  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/",
  });

  return cart;
}

export async function addToCart(
  variantId: string,
  quantity: number
): Promise<Cart> {
  let cart = await getCart();
  if (!cart) {
    cart = await createCart();
  }

  const { cart: updated } = await medusaClient.client.fetch<{
    cart: Cart;
  }>(`/store/carts/${cart.id}/line-items`, {
    method: "POST",
    body: { variant_id: variantId, quantity },
  });

  revalidatePath("/");
  revalidatePath("/cart");

  return updated;
}

export type CartDetails = {
  email: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  postal_code: string;
  city: string;
  country_code: string;
  phone?: string;
};

export async function updateCartDetails(
  cartId: string,
  details: CartDetails
): Promise<boolean> {
  const address = {
    first_name: details.first_name,
    last_name: details.last_name,
    address_1: details.address_1,
    address_2: details.address_2 || undefined,
    postal_code: details.postal_code,
    city: details.city,
    country_code: details.country_code.toLowerCase(),
    phone: details.phone || undefined,
  };

  try {
    await medusaClient.client.fetch(`/store/carts/${cartId}`, {
      method: "POST",
      body: {
        email: details.email,
        shipping_address: address,
        billing_address: address,
      },
    });
    revalidatePath("/checkout");
    return true;
  } catch {
    return false;
  }
}
