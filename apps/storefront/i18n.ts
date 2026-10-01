import { getRequestConfig } from "next-intl/server";

const envLocales = (process.env.NEXT_PUBLIC_LOCALES ?? "")
  .split(",")
  .map((l) => l.trim())
  .filter(Boolean);

export const locales: string[] = envLocales.length > 0 ? envLocales : ["fr", "en"];
export type Locale = string;
export const defaultLocale: Locale =
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? locales[0] ?? "fr";

export const isValidLocale = (locale: string): locale is Locale =>
  locales.includes(locale);

async function loadMessages(locale: string) {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch {
    return (await import(`./messages/${defaultLocale}.json`)).default;
  }
}

export default getRequestConfig(async ({ locale }) => {
  const safeLocale =
    locale && isValidLocale(locale) ? locale : defaultLocale;

  return {
    locale: safeLocale,
    messages: await loadMessages(safeLocale),
  };
});
