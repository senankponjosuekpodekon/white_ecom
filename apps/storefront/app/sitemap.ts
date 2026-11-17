import { getProducts } from "@/lib/get-products";
import type { Product } from "@/lib/types";
import type { StoreConfig } from "@/lib/get-store-config";
import { getStoreConfig } from "@/lib/get-store-config";
import { getLocalizedContent, getSiteUrl } from "@/lib/content";
import { locales, defaultLocale, type Locale } from "@/i18n";

const staticPages = ["", "/products", "/shipping", "/returns", "/privacy", "/contact", "/legal", "/terms"];

export const revalidate = 3600;

// Build environments (e.g. preview deploys) may not reach the backend:
// bail out to static pages instead of hanging the route generation.
const FETCH_TIMEOUT_MS = 15_000;

const timeout = <T>(fallback: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(fallback), FETCH_TIMEOUT_MS));

export default async function sitemap() {
  const [products, config] = await Promise.all([
    Promise.race<Product[]>([getProducts(), timeout<Product[]>([])]).catch(
      () => [] as Product[]
    ),
    Promise.race<StoreConfig | undefined>([
      getStoreConfig(),
      timeout<StoreConfig | undefined>(undefined),
    ]).catch(() => undefined),
  ]);
  const defaultLoc =
    (config?.defaultLanguage as Locale | undefined) ?? defaultLocale;
  const localized = getLocalizedContent(config?.content, defaultLoc, defaultLoc);
  const base = getSiteUrl(
    localized,
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:8080"
  ).replace(/\/$/, "");

  const pages = locales.flatMap((locale) =>
    staticPages.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "monthly" as const,
      priority: path === "" ? 1 : 0.5,
    }))
  );

  const productPages = products.flatMap((product) =>
    locales.map((locale) => ({
      url: `${base}/${locale}/products/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }))
  );

  return [...pages, ...productPages];
}
