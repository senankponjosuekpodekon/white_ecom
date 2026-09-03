"use client";

import { useEffect } from "react";
import { viewItemList, type AnalyticsItem } from "@/lib/analytics";

export function AnalyticsViewItemList({ items }: { items: AnalyticsItem[] }) {
  useEffect(() => {
    viewItemList(items);
  }, [items]);
  return null;
}
