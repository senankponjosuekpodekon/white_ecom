import Image from "next/image"
import Link from "next/link"
import { getProducts } from "@/lib/get-products"
import { formatPrice } from "@/lib/format"
import { locales, defaultLocale, type Locale } from "@/i18n"
import { MinimogHeader } from "@/components/minimog/Header"
import { MinimogFooter } from "@/components/minimog/Footer"

export const dynamic = "force-dynamic"

export default async function MinimogProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale
  const products = await getProducts(24)

  return (
    <>
      <MinimogHeader id="minimog-header" settings={{ sticky_header: true }} locale={locale} />
      <main className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Container</h1>
          {products.length === 0 ? (
            <p className="text-gray-500">Keine Produkte verfügbar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const price = product.variants[0]?.prices?.[0]
                return (
                  <Link
                    key={product.id}
                    href={`/${locale}/minimog/products/${product.handle}`}
                    className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative h-56 bg-gray-100">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                          {product.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h2 className="font-medium text-gray-900 group-hover:text-gray-700">
                        {product.title}
                      </h2>
                      {price && (
                        <p className="mt-1 font-bold text-gray-900">
                          {formatPrice(price.amount, price.currency_code)}
                        </p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <MinimogFooter id="minimog-footer" settings={{ show_social: true, newsletter: true }} />
    </>
  )
}
