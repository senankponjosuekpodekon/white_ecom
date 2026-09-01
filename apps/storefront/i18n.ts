import { getRequestConfig } from "next-intl/server";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const isValidLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale);

export default getRequestConfig(async ({ locale }) => {
  const safeLocale =
    locale && isValidLocale(locale) ? locale : defaultLocale;

  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default,
  };
});
