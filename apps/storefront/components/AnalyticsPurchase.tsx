"use client";

import { useEffect } from "react";
import { purchase, type AnalyticsItem } from "@/lib/analytics";

export function AnalyticsPurchase({
  orderId,
  value,
  currency,
  items,
}: {
  orderId: string;
  value: number;
  currency: string;
  items: AnalyticsItem[];
}) {
  useEffect(() => {
    purchase(orderId, value, currency, items);
  }, [orderId, value, currency, items]);
  return null;
}
