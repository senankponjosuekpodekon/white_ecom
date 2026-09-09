"use server";

import { addToCart, removeFromCart, updateLineItem } from "@/lib/cart";

export async function addToCartAction(formData: FormData) {
  const variantId = formData.get("variantId") as string;
  const quantity = Number(formData.get("quantity") ?? 1);

  if (!variantId) {
    throw new Error("Missing variantId");
  }

  await addToCart(variantId, quantity);
}

export async function removeFromCartAction(formData: FormData) {
  const lineItemId = formData.get("lineItemId") as string;
  if (!lineItemId) {
    throw new Error("Missing lineItemId");
  }
  await removeFromCart(lineItemId);
}

export async function updateLineItemAction(formData: FormData) {
  const lineItemId = formData.get("lineItemId") as string;
  const quantity = Number(formData.get("quantity") ?? 1);
  if (!lineItemId) {
    throw new Error("Missing lineItemId");
  }
  await updateLineItem(lineItemId, quantity);
}
