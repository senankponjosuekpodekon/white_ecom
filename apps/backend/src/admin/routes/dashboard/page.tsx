import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const cardStyle: React.CSSProperties = {
  padding: "1rem",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  minWidth: "160px",
  flex: "1",
}

const Dashboard = () => {
  const [data, setData] = useState({
    productCount: 0,
    customerCount: 0,
    orderCount: 0,
    revenue: 0,
    recentOrders: [] as Array<{ id: string; display_id: string; total: number; status: string; created_at: string }>,
    dailySales: [] as Array<{ day: string; total: number }>,
    statusCounts: {} as Record<string, number>,
    topProducts: [] as Array<{ title: string; quantity: number }>,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, customersRes, ordersRes] = await Promise.all([
          fetch("/admin/products?limit=1"),
          fetch("/admin/customers?limit=1"),
          fetch(
            "/admin/orders?limit=50&order=-created_at&fields=id,total,status,created_at,items.title,items.quantity"
          ),
        ])

        const products = await productsRes.json()
        const customers = await customersRes.json()
        const orders = await ordersRes.json()

        const allOrders = orders.orders ?? []
        const revenue = allOrders.reduce((sum: number, order: any) => sum + (order.total ?? 0), 0)

        const statusCounts: Record<string, number> = {}
        const productMap: Record<string, number> = {}
        const dailyMap: Record<string, number> = {}

        for (const order of allOrders) {
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

        const last7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          return d.toISOString().slice(0, 10)
        })

        const topProducts = Object.entries(productMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([title, quantity]) => ({ title, quantity }))

        setData({
          productCount: products.count ?? 0,
          customerCount: customers.count ?? 0,
          orderCount: orders.count ?? 0,
          revenue,
          recentOrders: allOrders.slice(0, 5).map((order: any) => ({
            id: order.id,
            display_id: order.display_id ?? order.id,
            total: order.total ?? 0,
            status: order.status ?? "N/A",
            created_at: order.created_at ? new Date(order.created_at).toLocaleDateString("fr-FR") : "",
          })),
          dailySales: last7.map((day) => ({ day, total: dailyMap[day] ?? 0 })),
          statusCounts,
          topProducts,
        })
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function formatPrice(amount: number) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount / 100)
  }

  const maxDay = Math.max(...data.dailySales.map((d) => d.total), 1)

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
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{data.productCount}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Clients</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{data.customerCount}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Commandes</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{data.orderCount}</p>
            </div>
            <div style={cardStyle}>
              <p style={{ color: "#666", fontSize: "14px" }}>Revenus (50 dernières)</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{formatPrice(data.revenue)}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={cardStyle}>
              <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Ventes 7 derniers jours</h2>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "120px" }}>
                {data.dailySales.map((d) => (
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
              {data.topProducts.length === 0 ? (
                <p>Aucune vente.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {data.topProducts.map((p) => (
                    <li key={p.title} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
                      <span>{p.title}</span>
                      <span style={{ color: "#666" }}>{p.quantity}</span>
                    </li>
                  ))}
                </ul>
              )}
              <h2 style={{ fontSize: "1.1rem", margin: "1rem 0 0.5rem" }}>Statuts commandes</h2>
              {Object.entries(data.statusCounts).map(([status, count]) => (
                <div key={status} style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0" }}>
                  <span>{status}</span>
                  <span style={{ color: "#666" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Dernières commandes</h2>
          {data.recentOrders.length === 0 ? (
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
                {data.recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "0.75rem" }}>#{order.display_id}</td>
                    <td style={{ padding: "0.75rem" }}>{formatPrice(order.total)}</td>
                    <td style={{ padding: "0.75rem" }}>{order.status}</td>
                    <td style={{ padding: "0.75rem" }}>{order.created_at}</td>
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
})

export default Dashboard
