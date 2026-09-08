import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getProducts } from "@/lib/get-products";
import { getCategories } from "@/lib/get-categories";
import { locales, defaultLocale, type Locale } from "@/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "collections" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  unstable_noStore();
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "collections" });

  const [categories, products] = await Promise.all([getCategories(), getProducts(100)]);

  const stats = new Map<string, { count: number; thumbnail?: string | null }>();
  for (const product of products) {
    for (const category of product.categories ?? []) {
      const current = stats.get(category.id) ?? { count: 0 };
      current.count += 1;
      if (!current.thumbnail && product.thumbnail) {
        current.thumbnail = product.thumbnail;
      }
      stats.set(category.id, current);
    }
  }

  return (
    <main className="min-h-screen p-8 section-gradient">
      <div className="max-w-7xl mx-auto">
        <nav
          aria-label="breadcrumbs"
          className="text-sm text-[var(--color-muted)] mb-4 flex flex-wrap items-center gap-2"
        >
          <Link href={`/${locale}`} className="hover:underline">
            {t("breadcrumbHome")}
          </Link>
          <span>/</span>
          <span className="text-[var(--color-foreground)]">{t("title")}</span>
        </nav>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-[var(--color-foreground)]">
            {t("title")}
          </h1>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-[var(--color-muted)]">{t("noCollections")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => {
              const stat = stats.get(category.id) ?? { count: 0 };
              return (
                <Link
                  key={category.id}
                  href={`/${locale}/products?cat=${category.id}`}
                  className="group card-design overflow-hidden"
                >
                  <div className="aspect-square bg-[var(--color-surface)] overflow-hidden">
                    {stat.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={stat.thumbnail}
                        alt={category.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl font-heading text-[var(--color-muted)]">
                        {category.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h2 className="font-medium text-[var(--color-foreground)]">
                      {category.name}
                    </h2>
                    <p className="text-sm text-[var(--color-muted)] mt-1">
                      {stat.count} {t("productsCount")}
                    </p>
                    <span className="btn-primary inline-block mt-3 text-sm">
                      {t("view")}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  );
}
