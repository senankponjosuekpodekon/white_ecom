import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { getStoreConfig } from "@/lib/get-store-config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getStoreConfig().catch(() => null);
  const seo = config?.design?.seo;
  return {
    title: {
      default: config?.name ?? "White Shop",
      template: seo?.titleTemplate ?? "%s",
    },
    description: seo?.description,
    keywords: seo?.keywords,
    robots: seo?.robots,
    openGraph: {
      title: config?.name ?? "White Shop",
      description: seo?.description,
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
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

  const config = await getStoreConfig().catch(() => null);
  const design = config?.design;

  const cssVars = {
    "--color-primary": design?.colors?.primary ?? "#3B82F6",
    "--color-secondary": design?.colors?.secondary ?? "#1F2937",
    "--color-accent": design?.colors?.accent ?? "#10B981",
    "--color-surface": design?.colors?.surface ?? "#F8FAFC",
    "--color-background": design?.colors?.background ?? "#FFFFFF",
    "--color-foreground": design?.colors?.foreground ?? "#111827",
    "--color-muted": design?.colors?.muted ?? "#6B7280",
    "--color-border": design?.colors?.border ?? "#E5E7EB",
    "--font-heading": design?.typography?.heading ?? "Inter",
    "--font-body": design?.typography?.body ?? "Inter",
    "--background": design?.colors?.background ?? "#FFFFFF",
    "--foreground": design?.colors?.foreground ?? "#111827",
  } as React.CSSProperties;

  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr" style={cssVars}>
      <body
        className="antialiased min-h-screen flex flex-col"
        style={{ fontFamily: design?.typography?.body ?? "Inter" }}
      >
        <Header
          name={config?.name ?? "White Shop"}
          logoUrl={config?.logoUrl}
          locale={locale}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <main className="flex-1">{children}</main>
        </NextIntlClientProvider>
        {config?.design?.ux?.footerEnabled !== false && <Footer name={config?.name ?? "White Shop"} />}
      </body>
    </html>
  );
}
