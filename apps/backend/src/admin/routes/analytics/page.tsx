import { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useAnalyticsData } from "../../lib/analytics-data"

const periods = [
  { value: 7, label: "7 jours" },
  { value: 30, label: "30 jours" },
  { value: 90, label: "90 jours" },
  { value: 365, label: "1 an" },
]

const cardStyle: React.CSSProperties = {
  padding: "1rem",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  minWidth: "160px",
  flex: "1",
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100)
}

function downloadCsv(rows: string[][], filename: string) {
  const csv = rows.map((row) => row.map((c) => `"${c}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const Analytics = () => {
  const [tab, setTab] = useState<"overview" | "live" | "reports">("overview")
  const [period, setPeriod] = useState(7)
  const { data, loading } = useAnalyticsData(period, tab === "live" ? 15000 : undefined)

  const dataOrEmpty = data ?? {
    orders: [] as never[],
    orderCount: 0,
    revenue: 0,
    statusCounts: {},
    topProducts: [],
    dailySales: [] as Array<{ day: string; total: number }>,
  }

  const maxDay = Math.max(...dataOrEmpty.dailySales.map((d) => d.total), 1)

  const handleExport = () => {
    if (!data) return
    const rows = [
      ["commande", "total", "statut", "date"],
      ...data.orders.map((o) => [
        o.display_id,
        (o.total / 100).toString(),
        o.status,
        o.created_at ? new Date(o.created_at).toISOString() : "",
      ]),
    ]
    downloadCsv(rows, `orders-${period}days.csv`)
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem" }}>Analytics</h1>
        <button
          onClick={handleExport}
          style={{
            padding: "0.5rem 1rem",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Exporter (CSV)
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <button style={tabStyle(tab === "overview")} onClick={() => setTab("overview")}>
          Overview
        </button>
        <button style={tabStyle(tab === "live")} onClick={() => setTab("live")}>
          Live view
        </button>
        <button style={tabStyle(tab === "reports")} onClick={() => setTab("reports")}>
          Analytics reports
        </button>
        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          style={{ marginLeft: "auto", padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "6px" }}
        >
          {periods.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Chargement…</p>
      ) : tab === "overview" ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Commandes</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{dataOrEmpty.orderCount}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Revenus</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{formatPrice(dataOrEmpty.revenue)}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Panier moyen</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {dataOrEmpty.orderCount ? formatPrice(dataOrEmpty.revenue / dataOrEmpty.orderCount) : formatPrice(0)}
              </p>
            </div>
          </div>
          <div style={cardStyle}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Ventes {period} derniers jours</h2>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "140px" }}>
              {dataOrEmpty.dailySales.map((d) => (
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
          {dataOrEmpty.orders.length === 0 ? (
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
                {dataOrEmpty.orders.slice(0, 10).map((order) => (
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
            {Object.keys(dataOrEmpty.statusCounts).length === 0 ? (
              <p>Aucune donnée.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {Object.entries(dataOrEmpty.statusCounts).map(([status, count]) => (
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
            {dataOrEmpty.topProducts.length === 0 ? (
              <p>Aucune vente.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {dataOrEmpty.topProducts.map((p) => (
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
