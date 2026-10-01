import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { requireUser } from "../utils"

// Server-side analytics: aggregates orders across the whole range instead of
// relying on a 200-order client-side fetch.
const PAGE_SIZE = 500
const MAX_ORDERS = 20000

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) return

  const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffIso = cutoff.toISOString()

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any

  const statusCounts: Record<string, number> = {}
  const productMap: Record<string, number> = {}
  const dailyMap: Record<string, number> = {}
  let revenue = 0
  let orderCount = 0
  const recent: Array<Record<string, unknown>> = []

  let offset = 0
  let fetched = 0
  let total = 0

  do {
    const { data: orders, metadata } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "total",
        "status",
        "created_at",
        "items.title",
        "items.quantity",
      ],
      filters: { created_at: { $gte: cutoffIso } },
      pagination: {
        skip: offset,
        take: PAGE_SIZE,
        order: { created_at: "DESC" },
      },
    })

    total = metadata?.count ?? orders.length
    fetched += orders.length
    offset += orders.length
    if (!orders.length) break

    for (const order of orders) {
      orderCount += 1
      revenue += Number(order.total ?? 0)

      const status = order.status ?? "N/A"
      statusCounts[status] = (statusCounts[status] ?? 0) + 1

      const day = order.created_at
        ? new Date(order.created_at).toISOString().slice(0, 10)
        : ""
      if (day) {
        dailyMap[day] = (dailyMap[day] ?? 0) + Number(order.total ?? 0)
      }

      for (const item of order.items ?? []) {
        const title = (item as { title?: string }).title ?? "Sans titre"
        const qty = (item as { quantity?: number }).quantity ?? 1
        productMap[title] = (productMap[title] ?? 0) + qty
      }

      if (recent.length < 10) {
        recent.push(order as unknown as Record<string, unknown>)
      }
    }
  } while (offset < total && fetched < MAX_ORDERS)

  const range = Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    return d.toISOString().slice(0, 10)
  })

  res.json({
    orders: recent,
    orderCount,
    revenue,
    statusCounts,
    topProducts: Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([title, quantity]) => ({ title, quantity })),
    dailySales: range.map((day) => ({ day, total: dailyMap[day] ?? 0 })),
    truncated: fetched >= MAX_ORDERS && total > fetched,
  })
}
