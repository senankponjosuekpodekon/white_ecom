import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { getStoreConfig } from "@/lib/get-store-config";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getStoreConfig().catch(() => null);
  return {
    title: config?.name ?? "White Shop",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string } | Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;

  const config = await getStoreConfig().catch(() => ({
    name: "White Shop",
    primaryColor: "#111111",
    logoUrl: "",
    font: "Inter",
    defaultLanguage: defaultLocale,
    supportedLanguages: [defaultLocale],
  }));

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir="ltr"
      style={{ "--color-primary": config.primaryColor } as Record<string, string>}
    >
      <body className="antialiased" style={{ fontFamily: config.font }}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
