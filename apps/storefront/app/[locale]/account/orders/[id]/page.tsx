import { OrderDetail } from "@/components/OrderDetail"
import { locales, defaultLocale, type Locale } from "@/i18n"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale: raw, id } = await params
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale
  return <OrderDetail locale={locale} orderId={id} />
}
