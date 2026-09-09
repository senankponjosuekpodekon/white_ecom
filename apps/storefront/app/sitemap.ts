import { getProducts } from "@/lib/get-products";
import { getStoreConfig } from "@/lib/get-store-config";
import { locales } from "@/i18n";

const staticPages = ["", "/products", "/shipping", "/returns", "/privacy", "/contact", "/legal", "/terms"];

export const dynamic = "force-dynamic";

function isLocalhost(url: string): boolean {
  return /localhost|127\.0\.0\.1/.test(url);
}

export default async function sitemap() {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
    process.env.MEDUSA_BACKEND_URL ??
    "";
  const canFetch = backendUrl && !isLocalhost(backendUrl);

  const fallbackBase = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:8080"
  ).replace(/\/$/, "");

  const [products, config] = canFetch
    ? await Promise.all([getProducts(), getStoreConfig()])
    : [[] as Awaited<ReturnType<typeof getProducts>>, null];

  const base = (config?.siteUrl ?? fallbackBase).replace(/\/$/, "");

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
