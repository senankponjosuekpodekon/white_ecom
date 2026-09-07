import { getTranslations } from "next-intl/server";
import { getStoreConfig } from "@/lib/get-store-config";
import { getLocalizedContent } from "@/lib/content";
import { locales, defaultLocale, type Locale } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "legal" });
  const config = await getStoreConfig();
  const content = getLocalizedContent(
    config.content,
    locale,
    (config.defaultLanguage as Locale) ?? defaultLocale
  );
  const text = content.legal?.terms ?? t("terms");

  return (
    <main className="min-h-screen p-8 section-gradient">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
          {t("termsTitle")}
        </h1>
        <div className="prose prose-lg max-w-none text-[var(--color-muted)]">
          {text.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
