import { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const toHandle = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const CSV = () => {
  const [csvText, setCsvText] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/admin/products?limit=200")
      const data = await res.json()
      const products = data.products ?? []
      const rows = products.map((p: any) => {
        const variant = p.variants?.[0]
        const price = variant?.prices?.[0]
        return [
          p.title ?? "",
          p.handle ?? "",
          p.description ?? "",
          price ? (price.amount / 100).toString() : "",
          price?.currency_code ?? "",
          variant?.inventory_quantity ?? "",
          p.status ?? "",
          p.thumbnail ?? "",
        ].join(",")
      })
      const header = "title,handle,description,price,currency,stock,status,thumbnail"
      const csv = [header, ...rows].join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "products.csv"
      a.click()
      URL.revokeObjectURL(url)
      setResult(`Exporté : ${products.length} produits`)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    const lines = csvText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    if (lines.length === 0) return

    setLoading(true)
    setError(null)
    setResult(null)

    let created = 0
    try {
      for (const line of lines) {
        const [title, priceStr, currency, stock] = line.split(",").map((s) => s.trim())
        if (!title || !priceStr) continue
        const priceCents = Math.round(parseFloat(priceStr) * 100)
        if (!priceCents || priceCents <= 0) continue

        const payload = {
          title,
          handle: toHandle(title),
          status: "published",
          options: [{ title: "Default", values: ["Default"] }],
          variants: [
            {
              title: "Default",
              options: { Default: "Default" },
              prices: [{ currency_code: currency || "eur", amount: priceCents }],
              inventory_quantity: parseInt(stock || "0", 10),
              manage_inventory: true,
              allow_backorder: false,
            },
          ],
        }
        const res = await fetch("/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          created++
        }
      }
      setResult(`Importé : ${created} produit(s)`)
      setCsvText("")
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Import / Export CSV</h1>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        Exportez vos produits en CSV ou importez-en de nouveaux avec le format :{" "}
        <code>titre,prix,devise,stock</code>.
      </p>

      <button
        onClick={handleExport}
        disabled={loading}
        style={{
          padding: "0.5rem 1.5rem",
          background: "#111827",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
          marginBottom: "1.5rem",
        }}
      >
        Exporter les produits (CSV)
      </button>

      <div>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Importer des produits</h2>
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          rows={8}
          placeholder={"T-shirt Premium,19.90,eur,10\nMug Design,12.50,eur,25"}
          style={{
            width: "100%",
            padding: "0.75rem",
            fontSize: "14px",
            fontFamily: "monospace",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            marginBottom: "1rem",
          }}
        />
        <button
          onClick={handleImport}
          disabled={loading}
          style={{
            padding: "0.5rem 1.5rem",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Traitement..." : "Importer"}
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {result && <span style={{ color: "#16a34a" }}>{result}</span>}
        {error && <span style={{ color: "#dc2626" }}>{error}</span>}
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Import/Export CSV",
})

export default CSV
