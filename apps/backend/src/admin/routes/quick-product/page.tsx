import { useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const toHandle = (title: string) =>
  title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const QuickProduct = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    currency: "eur",
    imageUrl: "",
    status: "published" as "published" | "draft",
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    setError(null)

    const priceCents = Math.round(parseFloat(form.price) * 100)
    if (!form.title || !priceCents || priceCents <= 0) {
      setError("Titre et prix valides requis")
      setLoading(false)
      return
    }

    const handle = toHandle(form.title)
    const images = form.imageUrl ? [{ url: form.imageUrl }] : undefined
    const thumbnail = form.imageUrl || undefined

    const payload = {
      title: form.title,
      handle,
      description: form.description,
      status: form.status,
      thumbnail,
      images,
      options: [{ title: "Default", values: ["Default"] }],
      variants: [
        {
          title: "Default",
          options: { Default: "Default" },
          prices: [
            {
              currency_code: form.currency,
              amount: priceCents,
            },
          ],
          inventory_quantity: parseInt(form.stock || "0", 10),
          manage_inventory: true,
          allow_backorder: false,
        },
      ],
    }

    try {
      const res = await fetch("/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message ?? "Erreur lors de la création du produit")
      }
      setSaved(true)
      setForm({
        title: "",
        description: "",
        price: "",
        stock: "",
        currency: "eur",
        imageUrl: "",
        status: "published",
      })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Ajout rapide de produit
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        Créez un produit simple en quelques champs. Un handle et une variante par défaut sont générés automatiquement.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Titre
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            style={inputStyle}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Prix (€)
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Stock
            </label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Devise
            </label>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="eur">EUR</option>
              <option value="usd">USD</option>
              <option value="gbp">GBP</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Statut
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            URL image (optionnel)
          </label>
          <input
            name="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            style={inputStyle}
          />
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem" }}>
          <button
            type="submit"
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
            {loading ? "Création..." : "Créer le produit"}
          </button>
          {saved && <span style={{ color: "#16a34a" }}>Produit créé !</span>}
          {error && <span style={{ color: "#dc2626" }}>{error}</span>}
        </div>
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  fontSize: "14px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
}

export const config = defineRouteConfig({
  label: "Ajout rapide",
})

export default QuickProduct
