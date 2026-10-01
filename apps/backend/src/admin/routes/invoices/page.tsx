import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Input } from "@medusajs/ui"

type OrderSummary = {
  id: string
  display_id: string | number
  total: number
  currency_code: string
  status: string
  created_at: string
  email?: string
}

const fmt = (amount: number, currency: string) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: (currency ?? "eur").toUpperCase(),
  }).format(amount)

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

const buildInvoiceHtml = (order: any, storeName: string) => {
  const shipping = order.shipping_address ?? {}
  const billing = order.billing_address ?? shipping
  const addressBlock = (a: any) =>
    [
      `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim(),
      a.address_1,
      `${a.postal_code ?? ""} ${a.city ?? ""}`.trim(),
      (a.country_code ?? "").toUpperCase(),
    ]
      .filter(Boolean)
      .map(escapeHtml)
      .join("<br/>")

  const rows = (order.items ?? [])
    .map(
      (item: any) => `<tr>
        <td>${escapeHtml(item.title)}</td>
        <td>${escapeHtml(item.variant_title ?? item.variant?.title ?? "")}</td>
        <td style="text-align:right">${item.quantity}</td>
        <td style="text-align:right">${fmt(item.unit_price ?? 0, order.currency_code)}</td>
        <td style="text-align:right">${fmt((item.unit_price ?? 0) * (item.quantity ?? 0), order.currency_code)}</td>
      </tr>`
    )
    .join("")

  return `<!doctype html><html><head><meta charset="utf-8"><title>Facture ${order.display_id}</title>
<style>
  body { font-family: system-ui, sans-serif; color: #111; max-width: 720px; margin: 40px auto; padding: 0 16px; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .muted { color: #666; font-size: 13px; }
  .cols { display: flex; justify-content: space-between; margin: 24px 0; gap: 24px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
  th { text-align: left; border-bottom: 2px solid #111; padding: 6px 4px; }
  td { border-bottom: 1px solid #e5e7eb; padding: 6px 4px; }
  .totals { margin-left: auto; width: 260px; font-size: 13px; }
  .totals div { display: flex; justify-content: space-between; padding: 3px 0; }
  .totals .grand { font-weight: 700; font-size: 15px; border-top: 2px solid #111; margin-top: 6px; padding-top: 6px; }
</style></head><body>
  <h1>${escapeHtml(storeName)}</h1>
  <p class="muted">Facture #${escapeHtml(order.display_id)} — ${new Date(order.created_at).toLocaleDateString("fr-FR")}</p>
  <div class="cols">
    <div><strong>Facturé à</strong><br/>${addressBlock(billing) || escapeHtml(order.email ?? "")}</div>
    <div><strong>Livré à</strong><br/>${addressBlock(shipping) || "—"}</div>
  </div>
  <table><thead><tr><th>Produit</th><th>Variante</th><th style="text-align:right">Qté</th><th style="text-align:right">P.U.</th><th style="text-align:right">Total</th></tr></thead>
  <tbody>${rows}</tbody></table>
  <div class="totals">
    <div><span>Sous-total</span><span>${fmt(order.item_total ?? order.subtotal ?? order.total, order.currency_code)}</span></div>
    <div><span>Livraison</span><span>${fmt(order.shipping_total ?? 0, order.currency_code)}</span></div>
    ${(order.discount_total ?? 0) > 0 ? `<div><span>Réduction</span><span>-${fmt(order.discount_total, order.currency_code)}</span></div>` : ""}
    <div><span>TVA</span><span>${fmt(order.tax_total ?? 0, order.currency_code)}</span></div>
    <div class="grand"><span>Total</span><span>${fmt(order.total ?? 0, order.currency_code)}</span></div>
  </div>
</body></html>`
}

const Invoices = () => {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [storeName, setStoreName] = useState("Boutique")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/admin/orders?limit=100&order=-created_at&fields=id,display_id,total,currency_code,status,created_at,email").then((r) => r.json()),
      fetch("/admin/config").then((r) => r.json()).catch(() => ({})),
    ])
      .then(([ordersData, configData]) => {
        setOrders(ordersData.orders ?? [])
        if (configData?.config?.name) setStoreName(configData.config.name)
      })
      .catch(() => setError("Impossible de charger les commandes"))
      .finally(() => setLoading(false))
  }, [])

  const openInvoice = async (orderId: string) => {
    setError(null)
    try {
      const res = await fetch(`/admin/orders/${orderId}`)
      const { order } = await res.json()
      if (!order) throw new Error("not found")
      const win = window.open("", "_blank", "width=800,height=1000")
      if (!win) throw new Error("popup blocked")
      win.document.write(buildInvoiceHtml(order, storeName))
      win.document.close()
      win.focus()
      win.print()
    } catch {
      setError("Impossible de générer la facture")
    }
  }

  const filtered = orders.filter(
    (o) =>
      !search ||
      String(o.display_id).includes(search) ||
      (o.email ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Container className="p-6" style={{ maxWidth: "800px" }}>
      <Heading level="h1">Factures</Heading>
      <Text className="text-ui-fg-subtle mt-2">
        Générez une facture imprimable (ou enregistrable en PDF via le dialogue
        d'impression) pour chaque commande.
      </Text>

      <div className="mt-4" style={{ maxWidth: "320px" }}>
        <Input
          placeholder="Rechercher (n° ou email)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <Text className="text-ui-fg-error mt-4">{error}</Text>}
      {loading && <Text className="text-ui-fg-subtle mt-4">Chargement…</Text>}

      {!loading && filtered.length === 0 && (
        <Text className="text-ui-fg-subtle mt-6">Aucune commande.</Text>
      )}

      <div className="mt-4 space-y-2">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between border border-ui-border-base rounded-lg p-3"
          >
            <div>
              <span className="font-medium">#{order.display_id}</span>
              <span className="text-ui-fg-subtle ml-3 text-sm">
                {order.email ?? "—"} · {new Date(order.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm">
                {fmt(order.total, order.currency_code)}
              </span>
              <Button variant="secondary" onClick={() => openInvoice(order.id)}>
                Facture
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Factures",
  rank: 7,
})

export default Invoices
