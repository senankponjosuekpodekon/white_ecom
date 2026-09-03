import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n";

export async function Header({
  name,
  logoUrl,
  locale,
}: {
  name: string;
  logoUrl?: string;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3 text-xl font-bold">
            {logoUrl && (
              <img
                src={logoUrl}
                alt={name}
                className="h-8 w-auto object-contain"
              />
            )}
            <span>{name}</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href={`/${locale}/products`}
              className="text-sm font-medium hover:text-gray-600"
            >
              {t("products")}
            </Link>
            <Link
              href={`/${locale}/cart`}
              className="text-sm font-medium hover:text-gray-600"
            >
              {t("cart")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
