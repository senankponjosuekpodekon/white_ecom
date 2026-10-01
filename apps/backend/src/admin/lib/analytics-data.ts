import { useEffect, useState } from "react"

export type Order = {
  id: string
  display_id: string
  total: number
  status: string
  created_at: string
  items?: Array<{ title?: string; quantity?: number }>
}

export type AnalyticsData = {
  orders: Order[]
  orderCount: number
  revenue: number
  statusCounts: Record<string, number>
  topProducts: Array<{ title: string; quantity: number }>
  dailySales: Array<{ day: string; total: number }>
}

export function buildAnalytics(orders: Order[], days: number): AnalyticsData {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffIso = cutoff.toISOString()

  const filtered = orders.filter(
    (order) => !order.created_at || order.created_at >= cutoffIso
  )

  const revenue = filtered.reduce((sum, o) => sum + (o.total ?? 0), 0)

  const statusCounts: Record<string, number> = {}
  const productMap: Record<string, number> = {}
  const dailyMap: Record<string, number> = {}

  for (const order of filtered) {
    statusCounts[order.status ?? "N/A"] = (statusCounts[order.status ?? "N/A"] ?? 0) + 1
    const day = order.created_at ? new Date(order.created_at).toISOString().slice(0, 10) : ""
    if (day) {
      dailyMap[day] = (dailyMap[day] ?? 0) + (order.total ?? 0)
    }
    for (const item of order.items ?? []) {
      const title = item.title ?? "Sans titre"
      productMap[title] = (productMap[title] ?? 0) + (item.quantity ?? 1)
    }
  }

  const range = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return d.toISOString().slice(0, 10)
  })

  return {
    orders: filtered,
    orderCount: filtered.length,
    revenue,
    statusCounts,
    topProducts: Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([title, quantity]) => ({ title, quantity })),
    dailySales: range.map((day) => ({ day, total: dailyMap[day] ?? 0 })),
  }
}

export function useAnalyticsData(
  days: number,
  refreshMs?: number
): { data: AnalyticsData | null; loading: boolean } {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    // Server-side aggregation — accurate regardless of order volume.
    // Falls back to the 200-order client fetch if the endpoint is missing.
    fetch(`/admin/analytics?days=${days}`)
      .then((res) => {
        if (!res.ok) throw new Error("no endpoint")
        return res.json()
      })
      .then((d) => setData(d as AnalyticsData))
      .catch(() =>
        fetch(
          "/admin/orders?limit=200&order=-created_at&fields=id,total,status,created_at,items.title,items.quantity"
        )
          .then((res) => res.json())
          .then((d) => setData(buildAnalytics(d.orders ?? [], days)))
          .catch(() => {})
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    if (refreshMs) {
      const interval = setInterval(load, refreshMs)
      return () => clearInterval(interval)
    }
  }, [refreshMs, days])

  return { data, loading }
}
