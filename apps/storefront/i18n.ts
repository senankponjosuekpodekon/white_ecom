import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const isValidLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !isValidLocale(locale)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
