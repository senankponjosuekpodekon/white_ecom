import { getCart } from "@/lib/cart"
import { locales, defaultLocale, type Locale } from "@/i18n"
import { MinimogHeader } from "@/components/minimog/Header"
import { MinimogFooter } from "@/components/minimog/Footer"
import { MinimogCart } from "@/components/minimog/Cart"

export const dynamic = "force-dynamic"

export default async function MinimogCartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale
  const cart = await getCart()

  return (
    <>
      <MinimogHeader id="minimog-header" settings={{ sticky_header: true }} locale={locale} />
      <MinimogCart cart={cart} locale={locale} />
      <MinimogFooter id="minimog-footer" settings={{ show_social: true, newsletter: true }} />
    </>
  )
}
