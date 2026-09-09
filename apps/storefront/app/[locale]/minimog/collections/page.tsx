import Image from "next/image"
import Link from "next/link"
import { getCategories } from "@/lib/get-categories"
import { getProducts } from "@/lib/get-products"
import { locales, defaultLocale, type Locale } from "@/i18n"
import { MinimogHeader } from "@/components/minimog/Header"
import { MinimogFooter } from "@/components/minimog/Footer"

export const dynamic = "force-dynamic"

export default async function MinimogCollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale
  const [categories, products] = await Promise.all([getCategories(), getProducts(100)])

  const stats = new Map<string, { count: number; thumbnail?: string | null }>()
  for (const product of products) {
    for (const category of product.categories ?? []) {
      const current = stats.get(category.id) ?? { count: 0 }
      current.count += 1
      if (!current.thumbnail && product.thumbnail) {
        current.thumbnail = product.thumbnail
      }
      stats.set(category.id, current)
    }
  }

  return (
    <>
      <MinimogHeader id="minimog-header" settings={{ sticky_header: true }} locale={locale} />
      <main className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Kategorien</h1>
          {categories.length === 0 ? (
            <p className="text-gray-500">Keine Kategorien verfügbar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const stat = stats.get(category.id) ?? { count: 0 }
                return (
                  <Link
                    key={category.id}
                    href={`/${locale}/minimog/collections/${category.handle}`}
                    className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative h-56 bg-gray-100">
                      {stat.thumbnail ? (
                        <Image
                          src={stat.thumbnail}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="p-4 text-center">
                      <h2 className="font-medium text-gray-900">{category.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">{stat.count} Produkte</p>
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
