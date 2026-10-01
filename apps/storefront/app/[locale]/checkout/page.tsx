import { unstable_noStore } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCart } from "@/lib/cart";
import { getStoreConfig } from "@/lib/get-store-config";
import { initiatePaymentSession, getShippingOptions } from "@/lib/payment";
import { formatPrice } from "@/lib/format";
import type { AnalyticsItem } from "@/lib/analytics";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { CheckoutForm } from "@/components/CheckoutForm";
import { AnalyticsBeginCheckout } from "@/components/AnalyticsBeginCheckout";
import {
  saveAddressAction,
  setShippingAction,
  completeManualPaymentAction,
} from "./actions";

export const dynamic = "force-dynamic";

const COUNTRIES = [
  "fr", "be", "ch", "lu", "de", "es", "it", "pt", "nl", "ie", "gb", "us",
] as const;

type Step = "address" | "shipping" | "payment";

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-foreground)]";
const labelCls =
  "block text-sm font-medium mb-1 text-[var(--color-foreground)]";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ step?: string; error?: string }>;
}) {
  unstable_noStore();
  const { locale: raw } = await params;
  const sp = await searchParams;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "checkout" });
  const [cart, config] = await Promise.all([getCart(), getStoreConfig()]);

  if (!cart || cart.items.length === 0) {
    redirect(`/${locale}/cart`);
  }

  const isDigital = ["digital", "services"].includes(config.businessModel);
  const manualEnabled = process.env.MANUAL_PAYMENT_ENABLED === "true";
  const hasAddress = Boolean(
    cart.email &&
      (isDigital ||
        (cart.shipping_address?.address_1 &&
          cart.shipping_address?.city &&
          cart.shipping_address?.country_code))
  );
  const hasShipping = isDigital || (cart.shipping_methods?.length ?? 0) > 0;

  let step: Step;
  if (sp.step === "payment" && hasAddress && hasShipping) {
    step = "payment";
  } else if (sp.step === "shipping" && hasAddress && !isDigital) {
    step = "shipping";
  } else if (sp.step === "payment" && hasAddress && isDigital) {
    step = "payment";
  } else {
    step = hasAddress ? (hasShipping ? "payment" : "shipping") : "address";
  }

  const checkoutItems: AnalyticsItem[] = cart.items.map((item) => ({
    item_id: item.variant.id,
    item_name: item.title,
    item_variant: item.variant.title,
    price: item.unit_price,
    quantity: item.quantity,
    currency: cart.currency_code.toUpperCase(),
  }));

  let clientSecret: string | null = null;
  let shippingOptions: Awaited<ReturnType<typeof getShippingOptions>> = [];
  if (step === "payment") {
    [clientSecret, shippingOptions] = await Promise.all([
      initiatePaymentSession(cart.id, "pp_stripe_stripe"),
      Promise.resolve([]),
    ]);
  } else if (step === "shipping") {
    shippingOptions = await getShippingOptions(cart.id);
  }

  const addr = cart.shipping_address;

  return (
    <main className="min-h-screen p-8 section-gradient">
      <AnalyticsBeginCheckout
        value={cart.total}
        currency={cart.currency_code.toUpperCase()}
        items={checkoutItems}
      />
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-2 text-[var(--color-foreground)]">
          {t("title")}
        </h1>
        <p className="mb-6 text-[var(--color-muted)]">
          {t("total")}: {formatPrice(cart.total, cart.currency_code)}
        </p>

        {sp.error && (
          <p className="mb-4 text-sm text-red-600">{t("errorGeneric")}</p>
        )}

        {step === "address" && (
          <form action={saveAddressAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <input
              type="hidden"
              name="next"
              value={isDigital ? "payment" : "shipping"}
            />
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              {t("stepContact")}
            </h2>
            <div>
              <label className={labelCls} htmlFor="email">{t("email")}</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                defaultValue={cart.email ?? ""}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls} htmlFor="first_name">{t("firstName")}</label>
                <input
                  id="first_name"
                  name="first_name"
                  required
                  defaultValue={addr?.first_name ?? ""}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="last_name">{t("lastName")}</label>
                <input
                  id="last_name"
                  name="last_name"
                  required
                  defaultValue={addr?.last_name ?? ""}
                  className={inputCls}
                />
              </div>
            </div>
            {!isDigital && (
              <>
                <div>
                  <label className={labelCls} htmlFor="address_1">{t("address")}</label>
                  <input
                    id="address_1"
                    name="address_1"
                    required
                    defaultValue={addr?.address_1 ?? ""}
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls} htmlFor="postal_code">{t("postalCode")}</label>
                    <input
                      id="postal_code"
                      name="postal_code"
                      required
                      defaultValue={addr?.postal_code ?? ""}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="city">{t("city")}</label>
                    <input
                      id="city"
                      name="city"
                      required
                      defaultValue={addr?.city ?? ""}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="country_code">{t("country")}</label>
                  <select
                    id="country_code"
                    name="country_code"
                    required
                    defaultValue={(
                      addr?.country_code ??
                      config.defaultCountry
                    ).toLowerCase()}
                    className={inputCls}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="phone">{t("phone")}</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={addr?.phone ?? ""}
                    className={inputCls}
                  />
                </div>
              </>
            )}
            <button type="submit" className="w-full btn-primary">
              {t("continue")}
            </button>
          </form>
        )}

        {step === "shipping" && (
          <form action={setShippingAction} className="space-y-4">
            <input type="hidden" name="locale" value={locale} />
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              {t("selectShipping")}
            </h2>
            {shippingOptions.length === 0 ? (
              <p className="text-red-600">{t("noShipping")}</p>
            ) : (
              <>
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
                <button type="submit" className="w-full btn-primary">
                  {t("continue")}
                </button>
              </>
            )}
          </form>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              {t("stepPayment")}
            </h2>
            {clientSecret ? (
              <CheckoutForm clientSecret={clientSecret} locale={locale} />
            ) : manualEnabled ? (
              <p className="text-sm text-[var(--color-muted)]">
                {t("stripeDisabled")}
              </p>
            ) : (
              <p className="text-sm text-red-600">{t("missingPayment")}</p>
            )}

            {manualEnabled && (
              <form action={completeManualPaymentAction}>
                <input type="hidden" name="locale" value={locale} />
                <button type="submit" className="w-full btn-primary">
                  {t("payManually")}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
