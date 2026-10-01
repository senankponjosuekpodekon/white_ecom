import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getCatalogPage, semanticSearch } from "@/lib/get-products";
import { getCategories } from "@/lib/get-categories";
import { getStoreConfig } from "@/lib/get-store-config";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { ProductCard } from "@/components/ProductCard";
import { SortSelect } from "@/components/SortSelect";
import { AnalyticsViewItemList } from "@/components/AnalyticsViewItemList";
import type { AnalyticsItem } from "@/lib/analytics";

const gridCols = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

const SORTS = [
  { value: "default", key: "sortDefault" },
  { value: "newest", key: "sortNewest" },
  { value: "price-asc", key: "sortPriceAsc" },
  { value: "price-desc", key: "sortPriceDesc" },
  { value: "title-asc", key: "sortTitleAsc" },
  { value: "title-desc", key: "sortTitleDesc" },
] as const;

type SearchParams = Promise<{
  cat?: string;
  stock?: string;
  min?: string;
  max?: string;
  sort?: string;
  cols?: string;
  page?: string;
  q?: string;
}>;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "products" });
  const config = await getStoreConfig();
  const siteUrl =
    config.siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:8080";
  const title = t("title");
  const description = t("description");
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}/products`,
      siteName: config.name,
      type: "website",
    },
  };
}

function keepParams(
  params: Awaited<SearchParams>,
  overrides: Record<string, string | undefined>
): string {
  const next = new URLSearchParams();
  const all = { ...params, ...overrides };
  for (const [key, value] of Object.entries(all)) {
    if (value) next.set(key, value);
  }
  const qs = next.toString();
  return qs ? `?${qs}` : "";
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  unstable_noStore();
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "products" });

  const categoryId = sp.cat || undefined;
  const stockFilter = sp.stock === "1";
  const min = sp.min ? Number(sp.min) || null : null;
  const max = sp.max ? Number(sp.max) || null : null;
  const sort = SORTS.some((s) => s.value === sp.sort) ? (sp.sort as string) : "default";
  const cols = gridCols[Number(sp.cols) as 2 | 3 | 4] ? (sp.cols as string) : undefined;

  const [categories, config] = await Promise.all([
    getCategories(locale),
    getStoreConfig(),
  ]);

  const feed = config.design.feed;
  const perPage = feed.itemsPerPage ?? 12;
  const page = Math.max(1, Number(sp.page) || 1);

  const catalogOrder = (sort === "newest"
    ? "-created_at"
    : sort === "title-asc"
    ? "title"
    : sort === "title-desc"
    ? "-title"
    : sort === "price-asc"
    ? "price_asc"
    : sort === "price-desc"
    ? "price_desc"
    : undefined) as string | undefined;

  const search = sp.q?.trim() || undefined;
  const visibleCount = perPage * page;

  // Semantic search first (embeddings) when a query is present and no filters
  // are active — it ranks by meaning, not just keywords. Falls back to the
  // catalog endpoint which handles price/stock filtering and all sorting.
  let products: Awaited<ReturnType<typeof getCatalogPage>>["products"];
  let totalCount: number;

  const plainSearch =
    !!search && !categoryId && !stockFilter && min === null && max === null;
  const semantic = plainSearch
    ? await semanticSearch(search, locale)
    : null;

  if (semantic !== null) {
    products = semantic.slice(0, visibleCount);
    totalCount = semantic.length;
  } else {
    const result = await getCatalogPage({
      limit: visibleCount,
      offset: 0,
      categoryId,
      order: catalogOrder,
      q: search,
      locale,
      minPrice: min,
      maxPrice: max,
      inStock: stockFilter,
    });
    products = result.products;
    totalCount = result.count;
  }
  const hasMore = totalCount > visibleCount;
  const cardsPerRow = (feed.cardsPerRow ?? 3) as 2 | 3 | 4;
  const columns = cols ? gridCols[Number(cols) as 2 | 3 | 4] : gridCols[cardsPerRow] ?? gridCols[3];

  const items: AnalyticsItem[] = products
    .map((product) => {
      const variant = product.variants[0];
      const price = variant?.prices?.[0];
      if (!variant || !price) return null;
      return {
        item_id: variant.id,
        item_name: product.title,
        item_variant: variant.title,
        price: price.amount,
        currency: price.currency_code.toUpperCase(),
      } as AnalyticsItem;
    })
    .filter((item): item is AnalyticsItem => item !== null);

  const sortOptions = SORTS.map((s) => ({
    value: s.value,
    label: t(s.key),
  }));

  const activeCategory = categories.find((c) => c.id === categoryId);

  return (
    <main className="min-h-screen p-8 section-gradient">
      <AnalyticsViewItemList items={items} />
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
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-[var(--color-foreground)]">
            {activeCategory?.name ?? t("title")}
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {`${totalCount} ${t("results")}`}
          </p>
        </div>

        <form method="GET" action={`/${locale}/products`} className="mb-8 flex gap-2 max-w-md">
          {categoryId && <input type="hidden" name="cat" value={categoryId} />}
          <input
            type="search"
            name="q"
            defaultValue={search ?? ""}
            aria-label={t("searchPlaceholder")}
            placeholder={t("searchPlaceholder")}
            className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-foreground)]"
          />
          <button type="submit" className="btn-primary px-4 py-2 text-sm">
            {t("searchButton")}
          </button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
          <aside className="space-y-6 lg:sticky lg:top-8">
            <div>
              <h2 className="font-semibold text-[var(--color-foreground)] mb-3">
                {t("filterCategory")}
              </h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={keepParams(sp, { cat: undefined })}
                    className={categoryId ? "text-[var(--color-muted)] hover:underline" : "text-[var(--color-primary)] font-medium"}
                  >
                    {t("allCategories")}
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={keepParams(sp, { cat: category.id })}
                      className={categoryId === category.id ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-muted)] hover:underline"}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-[var(--color-foreground)] mb-3">
                {t("filterAvailability")}
              </h2>
              <Link
                href={keepParams(sp, { stock: stockFilter ? undefined : "1" })}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                    stockFilter
                      ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)] text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className="text-[var(--color-muted)]">{t("filterInStock")}</span>
              </Link>
            </div>

            <div>
              <h2 className="font-semibold text-[var(--color-foreground)] mb-3">
                {t("filterPrice")}
              </h2>
              <form method="GET" action={`/${locale}/products`} className="flex items-center gap-2">
                <input
                  type="hidden"
                  name="cat"
                  value={categoryId ?? ""}
                />
                {search && <input type="hidden" name="q" value={search} />}
                <input
                  type="number"
                  name="min"
                  defaultValue={sp.min ?? ""}
                  aria-label={t("filterMin")}
                  placeholder={t("filterMin")}
                  className="w-full px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm"
                />
                <span className="text-[var(--color-muted)]">–</span>
                <input
                  type="number"
                  name="max"
                  defaultValue={sp.max ?? ""}
                  aria-label={t("filterMax")}
                  placeholder={t("filterMax")}
                  className="w-full px-2 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm"
                />
                <button type="submit" className="btn-primary px-3 py-1.5 text-sm">
                  {t("filterApply")}
                </button>
              </form>
            </div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <SortSelect
                value={sort}
                options={sortOptions}
              />
              <div className="flex items-center gap-1">
                <span className="text-sm text-[var(--color-muted)] mr-1">
                  {t("columnsTitle")}
                </span>
                {[2, 3, 4].map((n) => (
                  <Link
                    key={n}
                    href={keepParams(sp, { cols: String(n) })}
                    className={`px-2 py-1 rounded border text-xs ${
                      (cols ?? String(feed.cardsPerRow ?? 3)) === String(n)
                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-[var(--color-border)] text-[var(--color-muted)]"
                    }`}
                  >
                    {n}
                  </Link>
                ))}
              </div>
            </div>

            {products.length === 0 ? (
              <p className="text-[var(--color-muted)]">{t("noProducts")}</p>
            ) : (
              <>
                <ul className={`grid ${columns} gap-8`}>
                  {products.map((product) => (
                    <li key={product.id}>
                      <ProductCard product={product} locale={locale} feed={feed} />
                    </li>
                  ))}
                </ul>
                {hasMore && (
                  <div className="text-center mt-10">
                    <Link
                      href={keepParams(sp, { page: String(page + 1) })}
                      className="btn-primary"
                    >
                      {t("loadMore")}
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
