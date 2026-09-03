import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getProduct } from "@/lib/get-product";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { addToCartAction } from "./actions";

export default async function ProductPage({
  params,
}: {
  params: { locale: string; handle: string } | Promise<{ locale: string; handle: string }>;
}) {
  const { locale: raw, handle } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const t = await getTranslations({ locale, namespace: "product" });
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        ) : (
          <div className="w-full h-96 bg-gray-100 rounded-lg mb-6" />
        )}
        <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
        {product.description && (
          <p className="text-lg text-gray-700 mb-6">{product.description}</p>
        )}

        <h2 className="text-xl font-semibold mb-3">{t("variants")}</h2>
        {product.variants.length === 0 ? (
          <p className="text-gray-600">{t("outOfStock")}</p>
        ) : (
          <ul className="space-y-2">
            {product.variants.map((variant) => (
              <li
                key={variant.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <span className="font-medium">{variant.title}</span>
                <form action={addToCartAction}>
                  <input type="hidden" name="variantId" value={variant.id} />
                  <input type="hidden" name="quantity" value="1" />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    {t("addToCart")}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
