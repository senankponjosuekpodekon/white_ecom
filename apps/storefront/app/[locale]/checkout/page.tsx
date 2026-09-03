import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCart } from "@/lib/cart";
import { initiatePaymentSession, getShippingOptions } from "@/lib/payment";
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
  const shippingOptions = await getShippingOptions(cart.id);

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
          {shippingOptions.length === 0 ? (
            <p className="text-red-600">{t("noShipping")}</p>
          ) : (
            <form action={completeManualPaymentAction} className="space-y-4">
              <input type="hidden" name="cartId" value={cart.id} />
              <input type="hidden" name="locale" value={locale} />

              <div>
                <p className="font-semibold mb-3">{t("selectShipping")}</p>
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="optionId"
                          value={option.id}
                          defaultChecked={option.id === shippingOptions[0].id}
                          required
                        />
                        <span>{option.name}</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        {option.amount.toFixed(2)}{" "}
                        {option.currency_code.toUpperCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                {t("payManually")}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
