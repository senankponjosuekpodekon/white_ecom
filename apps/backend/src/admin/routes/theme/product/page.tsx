import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type Block = { type: string; enabled: boolean; options?: Record<string, unknown> }

const CATALOG: Array<{ type: string; label: string }> = [
  { type: "breadcrumb", label: "Fil d'Ariane" },
  { type: "gallery", label: "Galerie" },
  { type: "title", label: "Titre" },
  { type: "price", label: "Prix" },
  { type: "tabs", label: "Onglets (description / livraison)" },
  { type: "buy_buttons", label: "Boutons d'achat" },
  { type: "meta", label: "Méta (SKU / marque)" },
  { type: "badges", label: "Badges" },
  { type: "shipping_info", label: "Info livraison" },
  { type: "trust_badge", label: "Badge de confiance" },
  { type: "inventory_status", label: "Statut stock" },
  { type: "share", label: "Partage social" },
  { type: "recommendations", label: "Produits similaires" },
  { type: "sticky_atc", label: "Sticky Add to Cart" },
]

const TEMPLATES: Record<string, { label: string; blocks: Block[] }> = {
  classique: {
    label: "Classique",
    blocks: [
      { type: "gallery", enabled: true },
      { type: "title", enabled: true },
      { type: "price", enabled: true },
      { type: "buy_buttons", enabled: true },
      { type: "tabs", enabled: true },
    ],
  },
  venteflash: {
    label: "Vente flash",
    blocks: [
      { type: "gallery", enabled: true },
      { type: "title", enabled: true },
      { type: "price", enabled: true },
      { type: "badges", enabled: true },
      { type: "buy_buttons", enabled: true },
      { type: "inventory_status", enabled: true },
      { type: "shipping_info", enabled: true },
      { type: "trust_badge", enabled: true },
    ],
  },
  premium: {
    label: "Premium",
    blocks: [
      { type: "gallery", enabled: true },
      { type: "title", enabled: true },
      { type: "price", enabled: true },
      { type: "buy_buttons", enabled: true },
      { type: "tabs", enabled: true },
      { type: "meta", enabled: true },
      { type: "trust_badge", enabled: true },
      { type: "shipping_info", enabled: true },
    ],
  },
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  fontSize: "14px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
}

const ProductPage = () => {
  const [content, setContent] = useState<Record<string, any>>({})
  const [locale, setLocale] = useState("fr")
  const [layout, setLayout] = useState("split")
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/content")
      .then((res) => res.json())
      .then((data) => {
        const c = data.content ?? {}
        setContent(c)
        const pp = c[locale]?.productPage
        setLayout(pp?.layout ?? "split")
        setBlocks(pp?.blocks ?? [])
      })
      .catch(() => setError("Impossible de charger le contenu"))
  }, [locale])

  const move = (index: number, dir: -1 | 1) => {
    setBlocks((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const toggle = (index: number) => {
    setBlocks((prev) =>
      prev.map((b, i) => (i === index ? { ...b, enabled: !b.enabled } : b))
    )
  }

  const remove = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  const add = (type: string) => {
    setBlocks((prev) => [...prev, { type, enabled: true }])
  }

  const applyTemplate = (key: string) => {
    setBlocks(TEMPLATES[key].blocks.map((b) => ({ ...b })))
  }

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    setError(null)
    try {
      const next = { ...content }
      if (!next[locale]) next[locale] = {}
      next[locale].productPage = { layout, blocks }
      const res = await fetch("/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: next }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur lors de la sauvegarde")
      }
      setContent(next)
      setSaved(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const labelOf = (type: string) => CATALOG.find((c) => c.type === type)?.label ?? type

  return (
    <div style={{ padding: "2rem", maxWidth: "900px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Page produit</h1>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        Configurez les blocs affichés sur la fiche produit (inspiré de Shopify).
      </p>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: 600, marginRight: "0.5rem" }}>Langue :</label>
        <select value={locale} onChange={(e) => setLocale(e.target.value)} style={inputStyle as React.CSSProperties & { width: "auto" }}>
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>Layout</label>
        <select value={layout} onChange={(e) => setLayout(e.target.value)} style={inputStyle as React.CSSProperties & { width: "auto" }}>
          <option value="split">Split (média à gauche)</option>
          <option value="stacked">Empilé (média au-dessus)</option>
          <option value="slider">Slider (média pleine largeur)</option>
        </select>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>Templates</label>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {Object.entries(TEMPLATES).map(([key, tpl]) => (
            <button
              key={key}
              onClick={() => applyTemplate(key)}
              style={{
                padding: "0.5rem 1rem",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {tpl.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>Blocs</label>
        {blocks.length === 0 ? (
          <p>Aucun bloc. Ajoutez-en ci-dessous.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {blocks.map((block, index) => (
              <li
                key={`${block.type}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.5rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                  background: "white",
                }}
              >
                <input type="checkbox" checked={block.enabled} onChange={() => toggle(index)} />
                <span style={{ flex: 1 }}>{labelOf(block.type)}</span>
                <button onClick={() => move(index, -1)} style={iconBtn} disabled={index === 0}>↑</button>
                <button onClick={() => move(index, 1)} style={iconBtn} disabled={index === blocks.length - 1}>↓</button>
                <button onClick={() => remove(index)} style={iconBtn}>✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>Ajouter un bloc</label>
        <select
          onChange={(e) => {
            if (e.target.value) add(e.target.value)
            e.target.value = ""
          }}
          style={inputStyle as React.CSSProperties & { width: "auto" }}
          defaultValue=""
        >
          <option value="">— Choisir —</option>
          {CATALOG.map((c) => (
            <option key={c.type} value={c.type}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={handleSave}
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
          {loading ? "Sauvegarde..." : "Sauvegarder"}
        </button>
        {saved && <span style={{ color: "#16a34a" }}>Sauvegardé !</span>}
        {error && <span style={{ color: "#dc2626" }}>{error}</span>}
      </div>
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  padding: "0.25rem 0.5rem",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "4px",
  cursor: "pointer",
}

export const config = defineRouteConfig({
  label: "Page produit",
  rank: 3,
})

export default ProductPage
