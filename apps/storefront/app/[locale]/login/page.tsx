import { LoginForm } from "@/components/LoginForm"
import { locales, defaultLocale, type Locale } from "@/i18n"

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale
  return <LoginForm locale={locale} />
}
