import { unstable_noStore } from "next/cache";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { locales, defaultLocale, type Locale } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function CheckoutResultPage({
  params,
  searchParams,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
  searchParams: {
    order_id?: string;
    payment_intent_client_secret?: string;
  };
}) {
  unstable_noStore();
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "checkout" });
  const { order_id, payment_intent_client_secret } = searchParams;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>

        {order_id ? (
          <div className="space-y-4">
            <p className="text-green-700">{t("orderNumber")} : {order_id}</p>
            <Link
              href={`/${locale}/products`}
              className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              {t("continueShopping")}
            </Link>
          </div>
        ) : payment_intent_client_secret ? (
          <p className="text-gray-700">{t("processing")}</p>
        ) : (
          <p className="text-red-600">{t("paymentFailed")}</p>
        )}
      </div>
    </main>
  );
}
