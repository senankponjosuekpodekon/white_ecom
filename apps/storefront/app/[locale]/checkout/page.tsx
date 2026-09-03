import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCart } from "@/lib/cart";
import { initiatePaymentSession } from "@/lib/payment";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { CheckoutForm } from "@/components/CheckoutForm";
import { completeManualPaymentAction } from "./actions";

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

  const clientSecret = await initiatePaymentSession(cart.id, "pp_stripe_stripe");

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t("title")}</h1>
        <p className="mb-6 text-gray-600">
          {t("total")}: {cart.total.toFixed(2)} {cart.currency_code.toUpperCase()}
        </p>

        {clientSecret ? (
          <CheckoutForm clientSecret={clientSecret} locale={locale} />
        ) : (
          <p className="text-sm text-gray-600 mb-4">{t("stripeDisabled")}</p>
        )}

        <div className="mt-8 border-t pt-6">
          <form action={completeManualPaymentAction} className="space-y-4">
            <input type="hidden" name="cartId" value={cart.id} />
            <input type="hidden" name="locale" value={locale} />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              {t("payManually")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
