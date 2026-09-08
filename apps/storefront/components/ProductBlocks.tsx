import { FadeImage } from "./FadeImage"
import { AddToCartButton } from "./AddToCartButton"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/types"
import type { LocalizedContent, ProductPageBlock } from "@/lib/content"

const defaultBlocks: ProductPageBlock[] = [
  { type: "gallery", enabled: true },
  { type: "title", enabled: true },
  { type: "price", enabled: true },
  { type: "buy_buttons", enabled: true, options: { show_quantity: true, show_buy_now: true } },
  { type: "description", enabled: true },
  { type: "meta", enabled: false },
  { type: "badges", enabled: false },
  { type: "shipping_info", enabled: false },
  { type: "trust_badge", enabled: false },
  { type: "inventory_status", enabled: false },
]

function Gallery({ product }: { product: Product }) {
  return (
    <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
      {product.thumbnail ? (
        <FadeImage
          src={product.thumbnail}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)] text-6xl font-heading">
          {product.title.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  )
}

function VariantList({
  product,
  locale,
  t,
  options,
}: {
  product: Product
  locale: string
  t: (key: string) => string
  options?: Record<string, unknown>
}) {
  const showQuantity = options?.show_quantity !== false
  const showBuyNow = options?.show_buy_now !== false

  return (
    <div>
      <h2 className="text-xl font-heading font-semibold mb-4 text-[var(--color-foreground)]">
        {t("variants")}
      </h2>
      {product.variants.length === 0 ? (
        <p className="text-[var(--color-muted)]">{t("outOfStock")}</p>
      ) : (
        <ul className="space-y-3">
          {product.variants.map((variant) => {
            const price = variant.prices?.[0]
            if (!price) return null
            return (
              <li
                key={variant.id}
                className="card-design p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
              >
                <div>
                  <span className="font-medium text-[var(--color-foreground)]">
                    {variant.title}
                  </span>
                  <p className="text-[var(--color-primary)] font-bold">
                    {formatPrice(price.amount, price.currency_code)}
                  </p>
                </div>
                <AddToCartButton
                  variantId={variant.id}
                  variantTitle={variant.title}
                  productTitle={product.title}
                  price={price.amount / 100}
                  currency={price.currency_code}
                  label={t("addToCart")}
                  buyNowLabel={t("buyNow")}
                  quantityLabel={t("quantity")}
                  locale={locale}
                  showQuantity={showQuantity}
                  showBuyNow={showBuyNow}
                />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function ProductBlocks({
  product,
  locale,
  content,
  t,
}: {
  product: Product
  locale: string
  content: LocalizedContent
  t: (key: string) => string
}) {
  const blocks = content.productPage?.blocks ?? defaultBlocks
  const layout = content.productPage?.layout ?? "split"
  const enabled = blocks.filter((b) => b.enabled !== false)
  const gallery = enabled.find((b) => b.type === "gallery")
  const infoBlocks = enabled.filter((b) => b.type !== "gallery")

  const renderBlock = (block: ProductPageBlock) => {
    switch (block.type) {
      case "title":
        return (
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-[var(--color-foreground)]">
            {product.title}
          </h1>
        )
      case "price": {
        const first = product.variants[0]?.prices?.[0]
        if (!first) return null
        return (
          <p className="text-2xl font-bold text-[var(--color-primary)] mb-4">
            {formatPrice(first.amount, first.currency_code)}
          </p>
        )
      }
      case "buy_buttons":
        return (
          <VariantList
            product={product}
            locale={locale}
            t={t}
            options={block.options}
          />
        )
      case "description":
        return product.description ? (
          <p className="text-lg text-[var(--color-muted)] mb-8">{product.description}</p>
        ) : null
      case "meta": {
        const opts = block.options ?? {}
        const variant = product.variants[0]
        const showSku = opts.show_sku !== false && Boolean(variant?.sku)
        const showVendor = opts.show_vendor === true && Boolean(product.metadata?.brand)
        if (!showSku && !showVendor) return null
        return (
          <div className="text-sm text-[var(--color-muted)] mb-4 space-y-1">
            {showSku && <p>SKU : {variant.sku}</p>}
            {showVendor && <p>Marque : {String(product.metadata?.brand ?? "")}</p>}
          </div>
        )
      }
      case "badges": {
        const badge = product.metadata?.badge
        if (!badge) return null
        return (
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 bg-[var(--color-accent)] text-white">
            {String(badge)}
          </span>
        )
      }
      case "shipping_info": {
        const text =
          content.merchant?.shipping ?? content.policies?.shipping
        if (!text) return null
        return (
          <div className="card-design p-4 mb-4 text-sm text-[var(--color-muted)]">
            {text}
          </div>
        )
      }
      case "trust_badge":
        return (
          <div className="card-design p-4 mb-4 text-sm text-[var(--color-muted)]">
            Paiement sécurisé — Garantie satisfait ou remboursé.
          </div>
        )
      case "inventory_status": {
        const variant = product.variants[0]
        if (!variant || variant.manage_inventory === false) return null
        const qty = variant.inventory_quantity ?? 0
        const low = qty > 0 && qty <= 5
        return (
          <p className={`text-sm mb-4 ${qty === 0 ? "text-red-600" : low ? "text-amber-600" : "text-green-700"}`}>
            {qty === 0 ? t("outOfStock") : low ? `Plus que ${qty} en stock !` : "En stock"}
          </p>
        )
      }
      default:
        return null
    }
  }

  const media = gallery ? (
    <div key="gallery" className={layout === "stacked" ? "mb-8" : ""}>
      <Gallery product={product} />
    </div>
  ) : null

  const info = (
    <div key="info" className="space-y-4">
      {infoBlocks.map((block) => (
        <div key={block.type}>{renderBlock(block)}</div>
      ))}
    </div>
  )

  if (layout === "stacked") {
    return (
      <div className="max-w-3xl mx-auto">
        {media}
        {info}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      {media}
      {info}
    </div>
  )
}
