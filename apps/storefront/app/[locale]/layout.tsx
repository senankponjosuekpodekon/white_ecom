import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/i18n";
import { getStoreConfig } from "@/lib/get-store-config";
import { getLocalizedContent } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentGate } from "@/components/ConsentGate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
  const config = await getStoreConfig().catch(() => null);
  const localized = config
    ? getLocalizedContent(config.content, locale, (config.defaultLanguage as Locale) ?? defaultLocale)
    : getLocalizedContent({}, locale);
  const siteUrl =
    config?.siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:8080";
  const seo = config?.design?.seo;
  const site = localized.site;

  const languages: Record<string, string> = {};
  for (const l of config?.supportedLanguages ?? ["fr"]) {
    languages[l] = `/${l}`;
  }
  languages["x-default"] = `/${config?.defaultLanguage ?? defaultLocale}`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: config?.name ?? "White Shop",
      template: site?.titleTemplate ?? seo?.titleTemplate ?? "%s",
    },
    description: seo?.description ?? site?.description,
    keywords: seo?.keywords ?? site?.keywords,
    robots: seo?.robots,
    openGraph: {
      title: config?.name ?? "White Shop",
      description: seo?.description ?? site?.description,
      images: seo?.ogImage ? [{ url: seo.ogImage }] : [],
      type: "website",
    },
    alternates: {
      canonical: "/",
      languages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;

  const config = await getStoreConfig().catch(() => null);
  const design = config?.design;
  const localized = config
    ? getLocalizedContent(config.content, locale, (config.defaultLanguage as Locale) ?? defaultLocale)
    : getLocalizedContent({}, locale);

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

  // Runtime public config for the browser bundle — NEXT_PUBLIC_* values are
  // inlined at build time, so per-client containers inject them here instead.
  const publicConfig = {
    medusaBackendUrl:
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
      process.env.MEDUSA_BACKEND_URL,
    medusaPublishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  };

  return (
    <html lang={locale} dir="ltr" style={cssVars}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__PUBLIC_CONFIG__=${JSON.stringify(publicConfig).replace(/</g, "\\u003c")}`,
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col"
        style={{ fontFamily: design?.typography?.body ?? "Inter" }}
      >
        <Header
          name={config?.name ?? "White Shop"}
          logoUrl={config?.logoUrl}
          locale={locale}
          availableLocales={(config?.supportedLanguages ?? ["fr"]).filter((l) =>
            locales.includes(l)
          )}
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ConsentGate gtagId={localized.ads?.gtagId} locale={locale} />
          <main className="flex-1">{children}</main>
        </NextIntlClientProvider>
        {design?.ux?.footerEnabled !== false && (
          <Footer
            name={config?.name ?? "White Shop"}
            content={localized.footer}
          />
        )}
      </body>
    </html>
  );
}
