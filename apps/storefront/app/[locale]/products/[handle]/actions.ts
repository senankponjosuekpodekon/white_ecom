"use server";

import { addToCart } from "@/lib/cart";

export async function addToCartAction(formData: FormData) {
  const variantId = formData.get("variantId") as string;
  const quantity = Number(formData.get("quantity") ?? 1);

  if (!variantId) {
    throw new Error("Missing variantId");
  }

  await addToCart(variantId, quantity);
}
