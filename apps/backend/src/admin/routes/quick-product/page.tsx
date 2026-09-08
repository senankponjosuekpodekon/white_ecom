import { useEffect, useState } from "react"
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
    shortDescription: "",
    metaTitle: "",
    metaDescription: "",
  })
  const [productId, setProductId] = useState<string | null>(null)
  const [variantId, setVariantId] = useState<string | null>(null)
  const [template, setTemplate] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/config")
      .then((res) => res.json())
      .then((data) => {
        const config = data.config ?? {}
        if (config.defaultCurrency) {
          setForm((prev) => ({ ...prev, currency: config.defaultCurrency }))
        }
      })
      .catch(() => {})

    const id = new URLSearchParams(window.location.search).get("id")
    if (id) {
      setProductId(id)
    }
  }, [])

  useEffect(() => {
    if (!productId) return
    fetch(`/admin/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        const product = data.product
        if (!product) return
        const variant = product.variants?.[0]
        const price = variant?.prices?.[0]
        setVariantId(variant?.id ?? null)
        const meta = product.metadata ?? {}
        setForm({
          title: product.title ?? "",
          description: product.description ?? "",
          price: price ? (price.amount / 100).toString() : "",
          stock: variant?.inventory_quantity?.toString() ?? "",
          currency: price?.currency_code ?? form.currency,
          imageUrl: product.thumbnail ?? "",
          status: product.status ?? "published",
          shortDescription: meta.short_description ?? "",
          metaTitle: meta.meta_title ?? "",
          metaDescription: meta.meta_description ?? "",
        })
      })
      .catch(() => setError("Impossible de charger le produit"))
  }, [productId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleTemplate = (value: string) => {
    setTemplate(value)
    const templates: Record<string, { title: string; description: string; price: string }> = {
      tshirt: { title: "T-shirt", description: "T-shirt en coton premium.", price: "19.90" },
      mug: { title: "Mug", description: "Mug céramique 330 ml.", price: "12.50" },
      poster: { title: "Poster", description: "Poster haute qualité, formats variés.", price: "15.00" },
      ebook: { title: "E-book", description: "E-book numérique (PDF).", price: "9.90" },
    }
    const tpl = templates[value]
    if (tpl) {
      setForm((prev) => ({ ...prev, ...tpl }))
    }
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

    const basePayload = {
      title: form.title,
      handle,
      description: form.description,
      status: form.status,
      thumbnail,
      images,
      metadata: {
        short_description: form.shortDescription,
        meta_title: form.metaTitle,
        meta_description: form.metaDescription,
      },
    }

    const payload = productId
      ? {
          ...basePayload,
          variants: variantId
            ? [
                {
                  id: variantId,
                  title: "Default",
                  prices: [
                    {
                      currency_code: form.currency,
                      amount: priceCents,
                    },
                  ],
                },
              ]
            : undefined,
        }
      : {
          ...basePayload,
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
      const url = productId ? `/admin/products/${productId}` : "/admin/products"
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message ?? (productId ? "Erreur lors de la mise à jour" : "Erreur lors de la création du produit"))
      }
      setSaved(true)
      if (!productId) {
        setForm({
          title: "",
          description: "",
          price: "",
          stock: "",
          currency: "eur",
          imageUrl: "",
          status: "published",
          shortDescription: "",
          metaTitle: "",
          metaDescription: "",
        })
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        {productId ? "Édition rapide" : "Ajout rapide de produit"}
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        {productId
          ? "Modifiez les informations principales du produit."
          : "Créez un produit simple en quelques champs. Un handle et une variante par défaut sont générés automatiquement."}
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Template (optionnel)
          </label>
          <select
            value={template}
            onChange={(e) => handleTemplate(e.target.value)}
            style={inputStyle}
          >
            <option value="">— Aucun —</option>
            <option value="tshirt">T-shirt</option>
            <option value="mug">Mug</option>
            <option value="poster">Poster</option>
            <option value="ebook">E-book</option>
          </select>
        </div>
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
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.75rem" }}>SEO</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
                Description courte (optionnel)
              </label>
              <input
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
                Meta title (optionnel)
              </label>
              <input
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
                Meta description (optionnel)
              </label>
              <textarea
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                rows={3}
                style={inputStyle}
              />
            </div>
          </div>
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
            {loading
              ? productId ? "Sauvegarde..." : "Création..."
              : productId ? "Sauvegarder" : "Créer le produit"}
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
  nested: "/products",
  rank: 1,
})

export default QuickProduct
