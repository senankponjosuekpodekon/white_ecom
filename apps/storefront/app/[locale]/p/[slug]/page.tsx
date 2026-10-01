import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { getStoreConfig } from "@/lib/get-store-config";
import { getLocalizedContent, type CustomPageSection } from "@/lib/content";
import { getCategories } from "@/lib/get-categories";
import { getProducts } from "@/lib/get-products";
import { ProductCard } from "@/components/ProductCard";
import type { DesignFeed } from "@/lib/design";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const config = await getStoreConfig();
  const localized = getLocalizedContent(
    config?.content,
    locale,
    config?.defaultLanguage ?? defaultLocale
  );
  const page = localized.pages?.[slug];
  return { title: page?.title ?? slug };
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const config = await getStoreConfig();
  const localized = getLocalizedContent(
    config?.content,
    locale,
    config?.defaultLanguage ?? defaultLocale
  );
  const page = localized.pages?.[slug];

  if (!page || !page.sections?.length) {
    notFound();
  }

  const categories = await getCategories(locale).catch(() => []);
  const categoryIds = new Map(categories.map((c) => [c.handle, c.id]));

  const feed = config.design.feed;

  const sections = await Promise.all(
    page.sections.map(async (section) => {
      if (section.type === "products") {
        const categoryId = section.categoryHandle
          ? categoryIds.get(section.categoryHandle)
          : undefined;
        const products = await getProducts(
          section.limit ?? 8,
          categoryId,
          0,
          undefined,
          undefined,
          locale
        );
        return { section, products };
      }
      return { section, products: [] };
    })
  );

  return (
    <main className="min-h-screen">
      {page.title && (
        <h1 className="sr-only">{page.title}</h1>
      )}
      {sections.map(({ section, products }, i) => (
        <PageSection
          key={i}
          section={section}
          products={products}
          locale={locale}
          feed={feed}
        />
      ))}
    </main>
  );
}

function PageSection({
  section,
  products,
  locale,
  feed,
}: {
  section: CustomPageSection;
  products: Awaited<ReturnType<typeof getProducts>>;
  locale: Locale;
  feed: DesignFeed;
}) {
  switch (section.type) {
    case "hero":
      return (
        <section className="section-gradient py-20 px-8 text-center">
          <div className="max-w-3xl mx-auto">
            {section.title && (
              <h2 className="text-4xl font-heading font-bold mb-4 text-[var(--color-foreground)]">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <p className="text-lg text-[var(--color-muted)] mb-8">
                {section.subtitle}
              </p>
            )}
            {section.ctaLabel && section.ctaHref && (
              <Link href={section.ctaHref} className="btn-primary">
                {section.ctaLabel}
              </Link>
            )}
          </div>
        </section>
      );
    case "text":
      return (
        <section className="py-12 px-8">
          <div className="max-w-3xl mx-auto prose">
            {section.title && (
              <h2 className="text-2xl font-heading font-bold mb-4 text-[var(--color-foreground)]">
                {section.title}
              </h2>
            )}
            {section.text && (
              <p className="text-[var(--color-foreground)] whitespace-pre-line">
                {section.text}
              </p>
            )}
          </div>
        </section>
      );
    case "image":
      return section.image ? (
        <section className="py-12 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden">
              <Image
                src={section.image}
                alt={section.title ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 896px) 100vw, 896px"
              />
            </div>
            {section.title && (
              <p className="text-sm text-[var(--color-muted)] mt-2 text-center">
                {section.title}
              </p>
            )}
          </div>
        </section>
      ) : null;
    case "cta":
      return (
        <section className="py-16 px-8 bg-[var(--color-surface)]">
          <div className="max-w-3xl mx-auto text-center">
            {section.title && (
              <h2 className="text-3xl font-heading font-bold mb-4 text-[var(--color-foreground)]">
                {section.title}
              </h2>
            )}
            {section.subtitle && (
              <p className="text-[var(--color-muted)] mb-8">{section.subtitle}</p>
            )}
            {section.ctaLabel && section.ctaHref && (
              <Link href={section.ctaHref} className="btn-primary">
                {section.ctaLabel}
              </Link>
            )}
          </div>
        </section>
      );
    case "products":
      return (
        <section className="py-12 px-8">
          <div className="max-w-7xl mx-auto">
            {section.title && (
              <h2 className="text-2xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
                {section.title}
              </h2>
            )}
            {products.length === 0 ? (
              <p className="text-[var(--color-muted)]">—</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    feed={feed}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      );
    default:
      return null;
  }
}
