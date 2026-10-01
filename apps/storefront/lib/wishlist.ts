const KEY = "wishlist_product_ids";

export function getWishlistIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids.filter((i) => typeof i === "string") : [];
  } catch {
    return [];
  }
}

export function isInWishlist(productId: string): boolean {
  return getWishlistIds().includes(productId);
}

export function toggleWishlist(productId: string): string[] {
  const ids = getWishlistIds();
  const next = ids.includes(productId)
    ? ids.filter((id) => id !== productId)
    : [...ids, productId];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("wishlist-changed"));
  return next;
}
