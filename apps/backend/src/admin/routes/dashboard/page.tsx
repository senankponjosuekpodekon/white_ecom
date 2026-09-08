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
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, customersRes, ordersRes] = await Promise.all([
          fetch("/admin/products?limit=1"),
          fetch("/admin/customers?limit=1"),
          fetch("/admin/orders?limit=5&order=-created_at"),
        ])

        const products = await productsRes.json()
        const customers = await customersRes.json()
        const orders = await ordersRes.json()

        const allOrders = orders.orders ?? []
        const revenue = allOrders.reduce((sum: number, order: any) => sum + (order.total ?? 0), 0)

        setData({
          productCount: products.count ?? 0,
          customerCount: customers.count ?? 0,
          orderCount: orders.count ?? 0,
          revenue,
          recentOrders: allOrders.map((order: any) => ({
            id: order.id,
            display_id: order.display_id ?? order.id,
            total: order.total ?? 0,
            status: order.status ?? "N/A",
            created_at: order.created_at ? new Date(order.created_at).toLocaleDateString("fr-FR") : "",
          })),
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
              <p style={{ color: "#666", fontSize: "14px" }}>Revenus (5 dernières)</p>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{formatPrice(data.revenue)}</p>
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
