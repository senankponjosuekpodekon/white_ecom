"use client";

import { useEffect } from "react";
import { beginCheckout, type AnalyticsItem } from "@/lib/analytics";

export function AnalyticsBeginCheckout({
  value,
  currency,
  items,
}: {
  value: number;
  currency: string;
  items: AnalyticsItem[];
}) {
  useEffect(() => {
    beginCheckout(value, currency, items);
  }, [value, currency, items]);
  return null;
}
