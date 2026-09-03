"use client";

import { addToCartAction } from "@/lib/actions/cart";
import { addToCart } from "@/lib/analytics";

export function AddToCartButton({
  variantId,
  variantTitle,
  productTitle,
  price,
  currency,
  label,
}: {
  variantId: string;
  variantTitle: string;
  productTitle: string;
  price: number;
  currency: string;
  label: string;
}) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await addToCartAction(formData);
    addToCart({
      item_id: variantId,
      item_name: productTitle,
      item_variant: variantTitle,
      price,
      currency: currency.toUpperCase(),
      quantity: 1,
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="variantId" value={variantId} />
      <input type="hidden" name="quantity" value="1" />
      <button type="submit" className="btn-primary">
        {label}
      </button>
    </form>
  );
}
