"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";

export function WishlistButton({ productId }: { productId: string }) {
  const t = useTranslations("wishlist");
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isInWishlist(productId));
    const onChange = () => setActive(isInWishlist(productId));
    window.addEventListener("wishlist-changed", onChange);
    return () => window.removeEventListener("wishlist-changed", onChange);
  }, [productId]);

  return (
    <button
      type="button"
      aria-label={active ? t("remove") : t("add")}
      aria-pressed={active}
      data-testid="wishlist-button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow transition-colors ${
        active
          ? "bg-[var(--color-primary)] text-white"
          : "bg-white/90 text-[var(--color-muted)] hover:text-[var(--color-primary)]"
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M12 21C12 21 4 15.7 4 9.6 4 6.7 6.3 4.5 9.1 4.5c1.3 0 2.3.6 2.9 1.5.6-.9 1.6-1.5 2.9-1.5 2.8 0 5.1 2.2 5.1 5.1C20 15.7 12 21 12 21z" />
      </svg>
    </button>
  );
}
