import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useAnalyticsData } from "../../lib/analytics-data"

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

const Dashboard = () => {
  const [counts, setCounts] = useState({ productCount: 0, customerCount: 0 })
  const { data, loading } = useAnalyticsData(7)

  useEffect(() => {
    Promise.all([fetch("/admin/products?limit=1"), fetch("/admin/customers?limit=1")])
      .then(async ([p, c]) => {
        const products = await p.json()
        const customers = await c.json()
        setCounts({ productCount: products.count ?? 0, customerCount: customers.count ?? 0 })
      })
      .catch(() => {})
  }, [])

  const dataOrEmpty = data ?? {
    orders: [] as never[],
    orderCount: 0,
    revenue: 0,
    statusCounts: {},
    topProducts: [],
    dailySales: [] as Array<{ day: string; total: number }>,
  }

  const maxDay = Math.max(...dataOrEmpty.dailySales.map((d) => d.total), 1)

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Tableau de bord</h1>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Produits</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{counts.productCount}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Clients</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{counts.customerCount}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Commandes (7 j)</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{dataOrEmpty.orderCount}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Revenus (7 j)</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{formatPrice(dataOrEmpty.revenue)}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={cardStyle}>
              <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Ventes 7 derniers jours</h2>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "120px" }}>
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

            <div style={cardStyle}>
              <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Top produits</h2>
              {dataOrEmpty.topProducts.length === 0 ? (
                <p>Aucune vente.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {dataOrEmpty.topProducts.slice(0, 3).map((p) => (
                    <li key={p.title} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
                      <span>{p.title}</span>
                      <span style={{ color: "#666" }}>{p.quantity}</span>
                    </li>
                  ))}
                </ul>
              )}
              <h2 style={{ fontSize: "1.1rem", margin: "1rem 0 0.5rem" }}>Statuts commandes</h2>
              {Object.entries(dataOrEmpty.statusCounts).map(([status, count]) => (
                <div key={status} style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0" }}>
                  <span>{status}</span>
                  <span style={{ color: "#666" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Dernières commandes</h2>
          {dataOrEmpty.orders.length === 0 ? (
            <p>Aucune commande pour le moment.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", background: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ textAlign: "left", padding: "0.75rem" }}>Commande</th>
                  <th style={{ textAlign: "left", padding: "0.75rem" }}>Total</th>
                  <th style={{ textAlign: "left", padding: "0.75rem" }}>Statut</th>
                  <th style={{ textAlign: "left", padding: "0.75rem" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {dataOrEmpty.orders.slice(0, 5).map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.75rem" }}>#{order.display_id}</td>
                    <td style={{ padding: "0.75rem" }}>{formatPrice(order.total)}</td>
                    <td style={{ padding: "0.75rem" }}>{order.status}</td>
                    <td style={{ padding: "0.75rem" }}>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("fr-FR") : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Dashboard",
  rank: 1,
})

export default Dashboard
