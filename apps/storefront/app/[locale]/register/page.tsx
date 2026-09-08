import { RegisterForm } from "@/components/RegisterForm"
import { locales, defaultLocale, type Locale } from "@/i18n"

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale
  return <RegisterForm locale={locale} />
}
