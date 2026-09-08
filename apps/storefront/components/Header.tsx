import Image from "next/image";
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
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 text-xl font-bold text-[var(--color-foreground)] transition-transform duration-200 hover:scale-[1.02]"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={name}
                width={128}
                height={32}
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[var(--color-primary)] text-white text-sm font-bold">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
            <span>{name}</span>
          </Link>
          <nav className="flex gap-6">
            <Link
              href={`/${locale}/products`}
              className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              {t("products")}
            </Link>
            <Link
              href={`/${locale}/cart`}
              className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              {t("cart")}
            </Link>
            <Link
              href={`/${locale}/account`}
              className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              {t("account")}
            </Link>
            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-200"
            >
              {t("login")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
