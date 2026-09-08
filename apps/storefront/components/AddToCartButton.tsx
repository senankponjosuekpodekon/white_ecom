"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addToCartAction } from "@/lib/actions/cart"
import { addToCart } from "@/lib/analytics"

export function AddToCartButton({
  variantId,
  variantTitle,
  productTitle,
  price,
  currency,
  label,
  buyNowLabel,
  quantityLabel,
  locale,
  showQuantity = true,
  showBuyNow = true,
}: {
  variantId: string
  variantTitle: string
  productTitle: string
  price: number
  currency: string
  label: string
  buyNowLabel: string
  quantityLabel: string
  locale: string
  showQuantity?: boolean
  showBuyNow?: boolean
}) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  async function addToCartFor(quantityToAdd: number) {
    const formData = new FormData()
    formData.set("variantId", variantId)
    formData.set("quantity", String(quantityToAdd))
    await addToCartAction(formData)
    addToCart({
      item_id: variantId,
      item_name: productTitle,
      item_variant: variantTitle,
      price,
      currency: currency.toUpperCase(),
      quantity: quantityToAdd,
    })
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await addToCartFor(quantity)
  }

  async function handleBuyNow() {
    await addToCartFor(quantity)
    router.push(`/${locale}/checkout`)
  }

  return (
    <div className="flex flex-col gap-3">
      {showQuantity && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-foreground)]">
          <span>{quantityLabel}</span>
          <div className="flex items-center rounded-lg border border-[var(--color-border)] overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label={`${quantityLabel} −`}
              className="px-3 py-2 hover:bg-[var(--color-surface)]"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-12 text-center border-x border-[var(--color-border)] bg-[var(--color-surface)]"
              aria-label={quantityLabel}
            />
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              aria-label={`${quantityLabel} +`}
              className="px-3 py-2 hover:bg-[var(--color-surface)]"
            >
              +
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <button type="submit" className="btn-primary">
          {label}
        </button>
        {showBuyNow && (
          <button type="button" onClick={handleBuyNow} className="btn-secondary">
            {buyNowLabel}
          </button>
        )}
      </form>
    </div>
  )
}
