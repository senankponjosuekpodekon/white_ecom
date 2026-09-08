import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type Order = {
  id: string
  display_id: string
  total: number
  status: string
  created_at: string
  items?: Array<{ title?: string; quantity?: number }>
}

const cardStyle: React.CSSProperties = {
  padding: "1rem",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  minWidth: "160px",
  flex: "1",
}

const Analytics = () => {
  const [tab, setTab] = useState<"overview" | "live" | "reports">("overview")
  const [orders, setOrders] = useState<Order[]>([])
  const [orderCount, setOrderCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = () => {
    fetch("/admin/orders?limit=100&order=-created_at&fields=id,total,status,created_at,items.title,items.quantity")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders ?? [])
        setOrderCount(data.count ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [])

  const revenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0)

  const dailyMap: Record<string, number> = {}
  const statusMap: Record<string, number> = {}
  const productMap: Record<string, number> = {}

  for (const order of orders) {
    const day = order.created_at ? new Date(order.created_at).toISOString().slice(0, 10) : ""
    if (day) dailyMap[day] = (dailyMap[day] ?? 0) + (order.total ?? 0)
    statusMap[order.status ?? "N/A"] = (statusMap[order.status ?? "N/A"] ?? 0) + 1
    for (const item of order.items ?? []) {
      const title = item.title ?? "Sans titre"
      productMap[title] = (productMap[title] ?? 0) + (item.quantity ?? 1)
    }
  }

  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return d.toISOString().slice(0, 10)
  })
  const dailySales = last14.map((day) => ({ day, total: dailyMap[day] ?? 0 }))
  const maxDay = Math.max(...dailySales.map((d) => d.total), 1)

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([title, quantity]) => ({ title, quantity }))

  function formatPrice(amount: number) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount / 100)
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.5rem 1rem",
    background: active ? "#111827" : "white",
    color: active ? "white" : "#111827",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
  })

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Analytics</h1>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button style={tabStyle(tab === "overview")} onClick={() => setTab("overview")}>
          Overview
        </button>
        <button style={tabStyle(tab === "live")} onClick={() => setTab("live")}>
          Live view
        </button>
        <button style={tabStyle(tab === "reports")} onClick={() => setTab("reports")}>
          Analytics reports
        </button>
      </div>

      {loading ? (
        <p>Chargement…</p>
      ) : tab === "overview" ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Commandes</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{orderCount}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Revenus</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{formatPrice(revenue)}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Panier moyen</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {orders.length ? formatPrice(revenue / orders.length) : formatPrice(0)}
              </p>
            </div>
          </div>
          <div style={cardStyle}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Ventes 14 derniers jours</h2>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "140px" }}>
              {dailySales.map((d) => (
                <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                  <div
                    style={{
                      width: "100%",
                      background: "#3B82F6",
                      borderRadius: "4px 4px 0 0",
                      height: `${Math.max((d.total / maxDay) * 100, 4)}%`,
                    }}
                  />
                  <span style={{ fontSize: "10px", color: "#666" }}>{d.day.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : tab === "live" ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Commandes en direct (auto-refresh 15s)</h2>
          {orders.length === 0 ? (
            <p>Aucune commande pour le moment.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Commande</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Total</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Statut</th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.5rem" }}>#{order.display_id}</td>
                    <td style={{ padding: "0.5rem" }}>{formatPrice(order.total)}</td>
                    <td style={{ padding: "0.5rem" }}>{order.status}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {order.created_at ? new Date(order.created_at).toLocaleString("fr-FR") : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div style={cardStyle}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Statuts commandes</h2>
            {Object.entries(statusMap).length === 0 ? (
              <p>Aucune donnée.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {Object.entries(statusMap).map(([status, count]) => (
                  <li key={status} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span>{status}</span>
                    <span style={{ color: "#666" }}>{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={cardStyle}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Top produits</h2>
            {topProducts.length === 0 ? (
              <p>Aucune vente.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {topProducts.map((p) => (
                  <li key={p.title} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
                    <span>{p.title}</span>
                    <span style={{ color: "#666" }}>{p.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Analytics",
})

export default Analytics
