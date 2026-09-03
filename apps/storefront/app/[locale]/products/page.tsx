import { unstable_noStore } from "next/cache";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { getProducts } from "@/lib/get-products";
import { locales, defaultLocale, type Locale } from "@/i18n";

export const dynamic = "force-dynamic";

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
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      {products.length === 0 ? (
        <p className="text-gray-600">{t("noProducts")}</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <Link href={`/${locale}/products/${product.handle}`}>
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100" />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{product.title}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
