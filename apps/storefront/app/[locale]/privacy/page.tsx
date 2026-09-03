import { getTranslations } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { getStoreConfig } from "@/lib/get-store-config";
import { getLocalizedContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function PrivacyPage({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "policies" });
  const config = await getStoreConfig();
  const content = getLocalizedContent(
    config.content,
    locale,
    (config.defaultLanguage as Locale) ?? defaultLocale
  );
  const text = content.policies?.privacy ?? t("privacy");

  return (
    <main className="min-h-screen p-8 section-gradient">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
          {t("privacyTitle")}
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
