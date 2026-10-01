"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getWishlistIds } from "@/lib/wishlist";
import { getWishlistProducts } from "@/app/[locale]/wishlist/actions";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";
import type { DesignFullConfig } from "@/lib/design";

export function WishlistClient({
  locale,
  feed,
}: {
  locale: string;
  feed: DesignFullConfig["feed"];
}) {
  const t = useTranslations("wishlist");
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    const load = () => {
      const ids = getWishlistIds();
      getWishlistProducts(ids, locale).then(setProducts);
    };
    load();
    window.addEventListener("wishlist-changed", load);
    return () => window.removeEventListener("wishlist-changed", load);
  }, [locale]);

  if (products === null) {
    return <p className="text-[var(--color-muted)]">{t("loading")}</p>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-muted)] mb-4">{t("empty")}</p>
        <Link href={`/${locale}/products`} className="btn-primary">
          {t("browse")}
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} locale={locale} feed={feed} />
        </li>
      ))}
    </ul>
  );
}
