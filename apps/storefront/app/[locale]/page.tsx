import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { getStoreConfig } from "@/lib/get-store-config";
import { getLocalizedContent } from "@/lib/content";
import { HomeSections } from "@/components/HomeSections";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const config = await getStoreConfig();
  const localized = getLocalizedContent(
    config.content,
    locale,
    (config.defaultLanguage as Locale) ?? defaultLocale
  );
  const siteUrl =
    config.siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:8080";
  const title = config.name;
  const description = localized.site?.description ?? config.name;
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: config.name,
      type: "website",
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "home" });
  const config = await getStoreConfig();
  const design = config.design;
  const content = getLocalizedContent(
    config.content,
    locale,
    (config.defaultLanguage as Locale) ?? defaultLocale
  );

  return (
    <HomeSections locale={locale} content={content} design={design} t={t} />
  );
}
