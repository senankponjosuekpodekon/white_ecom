import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { medusaClient } from "./medusa-client";
import type { Cart } from "./types";

const CART_COOKIE = "cartId";

function getCartCookie() {
  return cookies().get(CART_COOKIE)?.value;
}

export async function getCart(): Promise<Cart | null> {
  const cartId = getCartCookie();
  if (!cartId) {
    return null;
  }

  try {
    const { cart } = await medusaClient.client.fetch<{ cart: Cart }>(
      `/store/carts/${cartId}`,
      { method: "GET" }
    );
    return cart ?? null;
  } catch {
    return null;
  }
}

export async function createCart(): Promise<Cart> {
  const { cart } = await medusaClient.client.fetch<{ cart: Cart }>(
    "/store/carts",
    { method: "POST" }
  );

  cookies().set(CART_COOKIE, cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
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
