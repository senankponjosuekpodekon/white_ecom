import { unstable_noStore } from "next/cache";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getCart } from "@/lib/cart";
import { locales, defaultLocale, type Locale } from "@/i18n";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export const dynamic = "force-dynamic";

export default async function CartPage({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  unstable_noStore();
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "cart" });
  const cart = await getCart();

  return (
    <main className="min-h-screen p-8 section-gradient">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-8 text-[var(--color-foreground)]">
          {t("title")}
        </h1>
        {(!cart || cart.items.length === 0) ? (
          <div className="space-y-4">
            <p className="text-[var(--color-muted)]">{t("empty")}</p>
            <Link href={`/${locale}/products`} className="btn-primary">
              {t("continueShopping")}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <ul className="divide-y divide-[var(--color-border)]">
              {cart.items.map((item) => (
                <li
                  key={item.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-[var(--color-foreground)]">{item.title}</p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {t("quantity")}: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-[var(--color-foreground)]">
                    {formatPrice(item.unit_price * item.quantity, cart.currency_code)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-[var(--color-border)] pt-4">
              <span className="text-lg font-semibold text-[var(--color-foreground)]">{t("total")}</span>
              <span className="text-lg font-semibold text-[var(--color-primary)]">
                {formatPrice(cart.total, cart.currency_code)}
              </span>
            </div>
            <Link
              href={`/${locale}/checkout`}
              className="block w-full text-center btn-primary"
            >
              {t("checkout")}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
