import { unstable_noStore } from "next/cache";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getCart } from "@/lib/cart";
import { locales, defaultLocale, type Locale } from "@/i18n";

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
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      {(!cart || cart.items.length === 0) ? (
        <div className="space-y-4">
          <p className="text-gray-600">{t("empty")}</p>
          <Link
            href={`/${locale}/products`}
            className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <ul className="divide-y">
            {cart.items.map((item) => (
              <li
                key={item.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-600">
                    {t("quantity")}: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {(item.unit_price * item.quantity).toFixed(2)}{" "}
                  {cart.currency_code.toUpperCase()}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-4">
            <span className="text-lg font-semibold">{t("total")}</span>
            <span className="text-lg font-semibold">
              {cart.total.toFixed(2)} {cart.currency_code.toUpperCase()}
            </span>
          </div>
          <form action={`/${locale}/checkout`}>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-black text-white rounded hover:bg-gray-800"
            >
              {t("checkout")}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
