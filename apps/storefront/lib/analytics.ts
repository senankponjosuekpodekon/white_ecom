export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity?: number;
  currency: string;
};

export function trackEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;
  gtag("event", name, params);
}

export function viewItemList(items: AnalyticsItem[]) {
  trackEvent("view_item_list", { items });
}

export function viewItem(item: AnalyticsItem) {
  trackEvent("view_item", { items: [item] });
}

export function addToCart(item: AnalyticsItem) {
  trackEvent("add_to_cart", { items: [item] });
}

export function beginCheckout(value: number, currency: string, items: AnalyticsItem[]) {
  trackEvent("begin_checkout", { value, currency, items });
}

export function purchase(orderId: string, value: number, currency: string, items: AnalyticsItem[]) {
  trackEvent("purchase", { transaction_id: orderId, value, currency, items });
}
