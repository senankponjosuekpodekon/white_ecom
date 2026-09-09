import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { AddToCartButton } from "@/components/AddToCartButton"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/types"
import type { Locale } from "@/i18n"

export async function MinimogProduct({
  product,
  locale,
}: {
  product: Product
  locale: Locale
}) {
  const t = await getTranslations({ locale, namespace: "product" })
  const firstVariant = product.variants[0]
  const firstPrice = firstVariant?.prices?.[0]

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="breadcrumbs" className="text-sm text-gray-500 mb-6">
          <Link href={`/${locale}/minimog`} className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/minimog/products`} className="hover:underline">Container</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-gray-100">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-400">
                {product.title.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            {firstPrice && (
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(firstPrice.amount, firstPrice.currency_code)}
              </p>
            )}
            {product.description && (
              <div
                className="prose prose-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
            {firstVariant && firstPrice && (
              <AddToCartButton
                variantId={firstVariant.id}
                variantTitle={firstVariant.title}
                productTitle={product.title}
                price={firstPrice.amount / 100}
                currency={firstPrice.currency_code}
                label={t("addToCart")}
                buyNowLabel={t("buyNow")}
                quantityLabel={t("quantity")}
                locale={locale}
              />
            )}
            {product.variants.length > 1 && (
              <div className="pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Varianten</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <span
                      key={v.id}
                      className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50"
                    >
                      {v.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
