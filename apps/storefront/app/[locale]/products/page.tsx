import { unstable_noStore } from "next/cache";
import { getTranslations } from "next-intl/server";
import { getProducts } from "@/lib/get-products";
import { getStoreConfig } from "@/lib/get-store-config";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { ProductCard } from "@/components/ProductCard";

const gridCols = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  unstable_noStore();
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "products" });
  const [products, config] = await Promise.all([getProducts(), getStoreConfig()]);
  const feed = config.design.feed;
  const cols = gridCols[feed.cardsPerRow] ?? gridCols[3];

  return (
    <main className="min-h-screen p-8 section-gradient">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-8 text-[var(--color-foreground)]">
          {t("title")}
        </h1>
        {products.length === 0 ? (
          <p className="text-[var(--color-muted)]">{t("noProducts")}</p>
        ) : (
          <ul className={`grid ${cols} gap-8`}>
            {products.slice(0, feed.itemsPerPage).map((product) => (
              <li key={product.id}>
                <ProductCard product={product} locale={locale} feed={feed} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
