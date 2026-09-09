import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProduct } from "@/lib/get-product"
import { getStoreConfig } from "@/lib/get-store-config"
import { locales, defaultLocale, type Locale } from "@/i18n"
import { MinimogHeader } from "@/components/minimog/Header"
import { MinimogFooter } from "@/components/minimog/Footer"
import { MinimogProduct } from "@/components/minimog/Product"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)
  if (!product) {
    return { title: "Produit introuvable" }
  }
  const config = await getStoreConfig()
  return {
    title: `${product.title} — Minimog`,
    description: product.description ?? config.name,
  }
}

export default async function MinimogProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { locale: raw, handle } = await params
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  return (
    <>
      <MinimogHeader
        id="minimog-header"
        settings={{ sticky_header: true }}
        locale={locale}
      />
      <MinimogProduct product={product} locale={locale} />
      <MinimogFooter
        id="minimog-footer"
        settings={{ show_social: true, newsletter: true }}
      />
    </>
  )
}
