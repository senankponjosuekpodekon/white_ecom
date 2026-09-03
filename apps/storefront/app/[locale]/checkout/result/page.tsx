import { unstable_noStore } from "next/cache";
import { getTranslations } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function CheckoutResultPage({
  params,
  searchParams,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
  searchParams: { payment_intent_client_secret?: string };
}) {
  unstable_noStore();
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "checkout" });
  const { payment_intent_client_secret } = searchParams;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
        <p className="text-gray-700">
          {payment_intent_client_secret
            ? t("processing")
            : t("paymentFailed")}
        </p>
      </div>
    </main>
  );
}
