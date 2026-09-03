import { unstable_noStore } from "next/cache";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { getOrder } from "@/lib/order";
import type { AnalyticsItem } from "@/lib/analytics";
import { AnalyticsPurchase } from "@/components/AnalyticsPurchase";

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

  const order = order_id ? await getOrder(order_id) : null;

  const purchaseItems: AnalyticsItem[] | undefined = order
    ? order.items.map((item) => ({
        item_id: item.variant.id,
        item_name: item.title,
        item_variant: item.variant.title,
        price: item.unit_price / 100,
        quantity: item.quantity,
        currency: order.currency_code.toUpperCase(),
      }))
    : undefined;

  return (
    <main className="min-h-screen p-8">
      {order && purchaseItems && (
        <AnalyticsPurchase
          orderId={order.id}
          value={order.total / 100}
          currency={order.currency_code.toUpperCase()}
          items={purchaseItems}
        />
      )}
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>

        {order_id ? (
          <div className="space-y-4">
            <p className="text-green-700">
              {t("orderNumber")} : {order_id}
            </p>
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
