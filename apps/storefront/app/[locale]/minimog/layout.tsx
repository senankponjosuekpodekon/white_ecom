import type { Metadata } from "next"
import { locales, defaultLocale, type Locale } from "@/i18n"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Atlas Container — Minimog Theme",
    description: "Container kaufen — Schnell, sicher und deutschlandweit geliefert",
  }
}

export default async function MinimogLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale

  return (
    <html lang={locale} dir="ltr">
      <body className="antialiased min-h-screen bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
