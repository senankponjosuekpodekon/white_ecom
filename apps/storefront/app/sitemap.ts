import { getProducts } from "@/lib/get-products";
import { getStoreConfig } from "@/lib/get-store-config";
import { locales } from "@/i18n";

const staticPages = ["", "/products", "/shipping", "/returns", "/privacy", "/contact", "/legal", "/terms"];

export const revalidate = 3600;

export default async function sitemap() {
  const [products, config] = await Promise.all([getProducts(), getStoreConfig()]);
  const base = (
    config.siteUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:8080"
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
