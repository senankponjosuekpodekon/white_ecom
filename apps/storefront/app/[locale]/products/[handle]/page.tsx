import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getProduct } from "@/lib/get-product";
import { getStoreConfig } from "@/lib/get-store-config";
import { getLocalizedContent, getSiteUrl } from "@/lib/content";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { JsonLd } from "@/components/JsonLd";
import { ProductBlocks } from "@/components/ProductBlocks";
import { AnalyticsViewItem } from "@/components/AnalyticsViewItem";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}): Promise<Metadata> {
  const { locale: raw, handle } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const product = await getProduct(handle);
  if (!product) {
    notFound();
  }

  const config = await getStoreConfig();
  const localized = getLocalizedContent(
    config.content,
    locale,
    (config.defaultLanguage as Locale) ?? defaultLocale
  );
  const siteUrl = getSiteUrl(
    localized,
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:8080"
  );
  const title = product.title;
  const description = product.description ?? localized.site?.description ?? "";

  const canonical = `/${locale}/products/${handle}`;
  const languages: Record<string, string> = {};
  for (const l of config.supportedLanguages) {
    languages[l] = `/${l}/products/${handle}`;
  }
  languages["x-default"] = `/${config.defaultLanguage ?? defaultLocale}/products/${handle}`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>;
}) {
  const { locale: raw, handle } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "product" });
  const [product, config] = await Promise.all([getProduct(handle), getStoreConfig()]);

  if (!product) {
    notFound();
  }

  const localized = getLocalizedContent(
    config.content,
    locale,
    (config.defaultLanguage as Locale) ?? defaultLocale
  );
  const siteUrl = getSiteUrl(
    localized,
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:8080"
  );
  const brand = localized.merchant?.brand ?? config.name;

  const offers = product.variants.map((variant) => {
    const price = variant.prices?.[0];
    return {
      "@type": "Offer" as const,
      sku: variant.id,
      price: price ? (price.amount / 100).toFixed(2) : "0.00",
      priceCurrency: price ? price.currency_code.toUpperCase() : "EUR",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/${locale}/products/${handle}`,
      itemOffered: {
        "@type": "Product",
        name: `${product.title} - ${variant.title}`,
      },
    };
  });

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? localized.site?.description ?? "",
    image: product.thumbnail ? [product.thumbnail] : [],
    brand: {
      "@type": "Brand",
      name: brand,
    },
    offers: offers.length > 0 ? offers : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/${locale}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `${siteUrl}/${locale}/products/${handle}`,
      },
    ],
  };

  const viewItemData = product.variants[0]?.prices?.[0]
    ? {
        item_id: product.variants[0].id,
        item_name: product.title,
        item_variant: product.variants[0].title,
        price: product.variants[0].prices[0].amount / 100,
        currency: product.variants[0].prices[0].currency_code.toUpperCase(),
      }
    : {
        item_id: product.id,
        item_name: product.title,
        price: 0,
        currency: "EUR",
      };

  return (
    <main className="min-h-screen p-8 section-gradient">
      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
      <AnalyticsViewItem item={viewItemData} />
      <div className="max-w-5xl mx-auto">
        <ProductBlocks product={product} locale={locale} content={localized} design={config.design} t={t} />
      </div>
    </main>
  );
}
