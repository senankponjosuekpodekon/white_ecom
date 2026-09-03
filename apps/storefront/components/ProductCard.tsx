import Link from "next/link";
import { DesignFullConfig } from "@/lib/design";
import { Product } from "@/lib/types";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function getPrice(product: Product) {
  const firstVariant = product.variants[0];
  const firstPrice = firstVariant?.prices?.[0];
  if (!firstPrice) return null;
  return formatPrice(firstPrice.amount, firstPrice.currency_code);
}

export function ProductCard({
  product,
  locale,
  feed,
}: {
  product: Product;
  locale: string;
  feed: DesignFullConfig["feed"];
}) {
  const hoverClass =
    feed.hoverEffect === "scale"
      ? "group-hover:scale-105"
      : feed.hoverEffect === "lift"
      ? "group-hover:-translate-y-1"
      : "";

  return (
    <article className="group card-design overflow-hidden">
      <Link href={`/${locale}/products/${product.handle}`} className="block">
        <div className="relative overflow-hidden">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className={`w-full h-56 object-cover transition-transform duration-300 ${hoverClass}`}
            />
          ) : (
            <div className="w-full h-56 bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)] text-4xl font-heading">
              {product.title.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="p-5">
          <h2 className="text-lg font-heading font-semibold mb-1 leading-tight line-clamp-2 text-[var(--color-foreground)]">
            {product.title}
          </h2>
          {feed.showDescription && (
            <p className="text-sm text-[var(--color-muted)] line-clamp-2 mb-3">
              {product.description || "\u00A0"}
            </p>
          )}
          {feed.showPrices && getPrice(product) ? (
            <span className="inline-block text-lg font-bold text-[var(--color-primary)]">
              {getPrice(product)}
            </span>
          ) : (
            <span className="inline-block text-sm text-[var(--color-muted)]">
              Voir le produit
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
