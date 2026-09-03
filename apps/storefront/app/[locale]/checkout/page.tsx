import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCart } from "@/lib/cart";
import { initiatePaymentSession } from "@/lib/payment";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { CheckoutForm } from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  unstable_noStore();
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "checkout" });
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    redirect(`/${locale}/cart`);
  }

  const clientSecret = await initiatePaymentSession(cart.id);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
        <p className="mb-6 text-gray-600">
          {t("securePayment")} — {cart.total.toFixed(2)}{" "}
          {cart.currency_code.toUpperCase()}
        </p>
        {clientSecret ? (
          <CheckoutForm clientSecret={clientSecret} locale={locale} />
        ) : (
          <p className="text-red-600">{t("missingPayment")}</p>
        )}
      </div>
    </main>
  );
}
