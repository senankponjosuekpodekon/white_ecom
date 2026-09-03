import { unstable_noStore } from "next/cache";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getProducts } from "@/lib/get-products";
import { locales, defaultLocale, type Locale } from "@/i18n";

export const dynamic = "force-dynamic";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function getPrice(product: Awaited<ReturnType<typeof getProducts>>[number]) {
  const firstVariant = product.variants[0];
  const firstPrice = firstVariant?.prices?.[0];
  if (!firstPrice) return null;
  return formatPrice(firstPrice.amount, firstPrice.currency_code);
}

export default async function ProductsPage({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  unstable_noStore();
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "products" });
  const products = await getProducts();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
        {products.length === 0 ? (
          <p className="text-gray-600">{t("noProducts")}</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <li
                key={product.id}
                className="group border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow"
              >
                <Link href={`/${locale}/products/${product.handle}`}>
                  {product.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400">
                      {product.title[0]}
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-lg font-semibold mb-1 leading-tight line-clamp-2">
                      {product.title}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                      {product.description || "\u00A0"}
                    </p>
                    {getPrice(product) ? (
                      <span className="inline-block text-lg font-bold">
                        {getPrice(product)}
                      </span>
                    ) : (
                      <span className="inline-block text-sm text-gray-500">
                        {t("noProducts")}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
