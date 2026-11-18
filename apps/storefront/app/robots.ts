import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "http://localhost:8080";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/*/cart", "/*/checkout", "/*/checkout/result", "/cart", "/checkout"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
