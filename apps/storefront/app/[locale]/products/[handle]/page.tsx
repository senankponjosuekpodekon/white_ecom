import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProduct } from "@/lib/get-product";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { addToCartAction } from "./actions";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export default async function ProductPage({
  params,
}: {
  params: { locale: string; handle: string } | Promise<{ locale: string; handle: string }>;
}) {
  const { locale: raw, handle } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "product" });
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 section-gradient">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)] text-6xl font-heading">
                {product.title.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-[var(--color-foreground)]">
              {product.title}
            </h1>
            {product.description && (
              <p className="text-lg text-[var(--color-muted)] mb-8">
                {product.description}
              </p>
            )}

            <h2 className="text-xl font-heading font-semibold mb-4 text-[var(--color-foreground)]">
              {t("variants")}
            </h2>
            {product.variants.length === 0 ? (
              <p className="text-[var(--color-muted)]">{t("outOfStock")}</p>
            ) : (
              <ul className="space-y-3">
                {product.variants.map((variant) => {
                  const price = variant.prices?.[0];
                  return (
                    <li
                      key={variant.id}
                      className="card-design p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                    >
                      <div>
                        <span className="font-medium text-[var(--color-foreground)]">
                          {variant.title}
                        </span>
                        {price && (
                          <p className="text-[var(--color-primary)] font-bold">
                            {formatPrice(price.amount, price.currency_code)}
                          </p>
                        )}
                      </div>
                      <form action={addToCartAction}>
                        <input type="hidden" name="variantId" value={variant.id} />
                        <input type="hidden" name="quantity" value="1" />
                        <button type="submit" className="btn-primary">
                          {t("addToCart")}
                        </button>
                      </form>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
