import { getTranslations } from "next-intl/server";
import { getStoreConfig } from "@/lib/get-store-config";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { WishlistClient } from "@/components/WishlistClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "wishlist" });
  return { title: t("title") };
}

export default async function WishlistPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "wishlist" });
  const config = await getStoreConfig();
  const feed = config.design.feed;

  return (
    <main className="min-h-screen p-8 section-gradient">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-8 text-[var(--color-foreground)]">
          {t("title")}
        </h1>
        <WishlistClient locale={locale} feed={feed} />
      </div>
    </main>
  );
}
