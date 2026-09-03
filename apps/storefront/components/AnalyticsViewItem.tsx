"use client";

import { useEffect } from "react";
import { viewItem, type AnalyticsItem } from "@/lib/analytics";

export function AnalyticsViewItem({ item }: { item: AnalyticsItem }) {
  useEffect(() => {
    viewItem(item);
  }, [item]);
  return null;
}
