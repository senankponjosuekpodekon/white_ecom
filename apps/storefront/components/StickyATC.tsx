"use client"

import { useEffect, useState } from "react"
import { addToCartAction } from "@/lib/actions/cart"
import { addToCart } from "@/lib/analytics"
import { formatPrice } from "@/lib/format"

export function StickyATC({
  variantId,
  variantTitle,
  productTitle,
  thumbnail,
  amount,
  currency,
  label,
  quantityLabel,
}: {
  variantId: string
  variantTitle: string
  productTitle: string
  thumbnail?: string | null
  amount: number
  currency: string
  label: string
  quantityLabel: string
}) {
  const [visible, setVisible] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  async function handleAdd() {
    if (adding) return
    setAdding(true)
    try {
      const formData = new FormData()
      formData.set("variantId", variantId)
      formData.set("quantity", String(quantity))
      await addToCartAction(formData)
      addToCart({
        item_id: variantId,
        item_name: productTitle,
        item_variant: variantTitle,
        price: amount / 100,
        currency: currency.toUpperCase(),
        quantity,
      })
    } finally {
      setAdding(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--color-border)] bg-[var(--background)] shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={productTitle}
            className="hidden sm:block w-12 h-12 rounded-lg object-cover"
          />
        )}
        <div className="hidden md:block min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--color-foreground)] truncate">
            {productTitle}
          </p>
          <p className="text-sm font-bold text-[var(--color-primary)]">
            {formatPrice(amount, currency)}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-auto">
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
          <button
            type="button"
            onClick={handleAdd}
            disabled={adding}
            className="btn-primary whitespace-nowrap disabled:opacity-60"
          >
            {adding ? "…" : label}
          </button>
        </div>
      </div>
    </div>
  )
}
