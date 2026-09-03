import { locales } from "@/i18n";

export default async function sitemap() {
  const base = "http://localhost:8080";

  return locales.flatMap((locale) => [
    {
      url: `${base}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${base}/${locale}/products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ]);
}
