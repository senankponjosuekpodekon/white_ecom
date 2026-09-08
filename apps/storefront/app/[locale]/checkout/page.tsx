import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCart } from "@/lib/cart";
import { getStoreConfig } from "@/lib/get-store-config";
import { initiatePaymentSession, getShippingOptions } from "@/lib/payment";
import type { AnalyticsItem } from "@/lib/analytics";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { CheckoutForm } from "@/components/CheckoutForm";
import { AnalyticsBeginCheckout } from "@/components/AnalyticsBeginCheckout";
import { completeManualPaymentAction } from "./actions";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  unstable_noStore();
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "checkout" });
  const [cart, config] = await Promise.all([getCart(), getStoreConfig()]);

  if (!cart || cart.items.length === 0) {
    redirect(`/${locale}/cart`);
  }

  const isDigital = ["digital", "services"].includes(config.businessModel);
  const clientSecret = await initiatePaymentSession(cart.id, "pp_stripe_stripe");
  const shippingOptions = isDigital ? [] : await getShippingOptions(cart.id);

  const checkoutItems: AnalyticsItem[] = cart.items.map((item) => ({
    item_id: item.variant.id,
    item_name: item.title,
    item_variant: item.variant.title,
    price: item.unit_price / 100,
    quantity: item.quantity,
    currency: cart.currency_code.toUpperCase(),
  }));

  return (
    <main className="min-h-screen p-8 section-gradient">
      <AnalyticsBeginCheckout
        value={cart.total / 100}
        currency={cart.currency_code.toUpperCase()}
        items={checkoutItems}
      />
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
          {t("title")}
        </h1>
        <p className="mb-6 text-[var(--color-muted)]">
          {t("total")}: {formatPrice(cart.total, cart.currency_code)}
        </p>

        {clientSecret ? (
          <CheckoutForm clientSecret={clientSecret} locale={locale} />
        ) : (
          <p className="text-sm text-[var(--color-muted)] mb-4">{t("stripeDisabled")}</p>
        )}

        <div className="mt-8 border-t border-[var(--color-border)] pt-6">
          {isDigital ? (
            <form action={completeManualPaymentAction} className="space-y-4">
              <input type="hidden" name="cartId" value={cart.id} />
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="optionId" value="none" />
              <p className="text-sm text-[var(--color-muted)] mb-4">
                {t("digitalCheckout")}
              </p>
              <button type="submit" className="w-full btn-primary">
                {t("pay")}
              </button>
            </form>
          ) : shippingOptions.length === 0 ? (
            <p className="text-red-600">{t("noShipping")}</p>
          ) : (
            <form action={completeManualPaymentAction} className="space-y-4">
              <input type="hidden" name="cartId" value={cart.id} />
              <input type="hidden" name="locale" value={locale} />

              <div>
                <p className="font-semibold mb-3 text-[var(--color-foreground)]">{t("selectShipping")}</p>
                <div className="space-y-2">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center justify-between p-3 border border-[var(--color-border)] rounded-lg cursor-pointer bg-white hover:bg-[var(--color-surface)] transition-colors"
                    >
                      <span className="flex items-center gap-3 text-[var(--color-foreground)]">
                        <input
                          type="radio"
                          name="optionId"
                          value={option.id}
                          defaultChecked={option.id === shippingOptions[0].id}
                          required
                        />
                        <span>{option.name}</span>
                      </span>
                      <span className="text-sm text-[var(--color-muted)]">
                        {formatPrice(option.amount, option.currency_code)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full btn-primary">
                {t("payManually")}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
