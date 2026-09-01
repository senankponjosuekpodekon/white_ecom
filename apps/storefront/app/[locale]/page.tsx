import { getTranslations } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { getStoreConfig } from "@/lib/get-store-config";

export default async function Home({
  params,
}: {
  params: { locale: string };
}) {
  const { locale: raw } = await (params as any);
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "home" });
  const config = await getStoreConfig().catch(() => ({
    name: "White Shop",
    primaryColor: "#111111",
  }));

  return (
    <main className="min-h-screen p-8">
      <h1
        className="text-4xl font-bold mb-4"
        style={{ color: "var(--color-primary)" }}
      >
        {config.name}
      </h1>
      <p className="text-lg">{t("subtitle")}</p>
    </main>
  );
}
