import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type Section = { type: string; enabled: boolean; options?: Record<string, unknown> }

const CATALOG: Array<{ type: string; label: string }> = [
  { type: "hero", label: "Hero (slideshow)" },
  { type: "marquee", label: "Bandeau défilant" },
  { type: "collections", label: "Collections" },
  { type: "featured_products", label: "Produits vedettes" },
  { type: "features", label: "Avantages" },
  { type: "value_proposition", label: "Proposition de valeur" },
  { type: "social_proof", label: "Preuve sociale" },
  { type: "cta", label: "Call to action" },
]

const TEMPLATES: Record<string, { label: string; sections: Section[] }> = {
  classique: {
    label: "Classique",
    sections: [
      { type: "hero", enabled: true },
      { type: "features", enabled: true },
      { type: "featured_products", enabled: true },
      { type: "cta", enabled: true },
    ],
  },
  vitrine: {
    label: "Vitrine (type Pellet Salamanca)",
    sections: [
      { type: "hero", enabled: true },
      { type: "marquee", enabled: true },
      { type: "collections", enabled: true },
      { type: "featured_products", enabled: true },
      { type: "featured_products", enabled: true },
      { type: "featured_products", enabled: true },
      { type: "cta", enabled: true },
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

const HomePage = () => {
  const [content, setContent] = useState<Record<string, any>>({})
  const [locale, setLocale] = useState("fr")
  const [sections, setSections] = useState<Section[]>([])
  const [optionsJson, setOptionsJson] = useState("{}")
  const [selected, setSelected] = useState<number>(-1)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/content")
      .then((res) => res.json())
      .then((data) => {
        const c = data.content ?? {}
        setContent(c)
        setSections(c[locale]?.homePage?.sections ?? [])
      })
      .catch(() => setError("Impossible de charger le contenu"))
  }, [locale])

  useEffect(() => {
    if (selected >= 0 && sections[selected]) {
      setOptionsJson(JSON.stringify(sections[selected].options ?? {}, null, 2))
    } else {
      setOptionsJson("{}")
    }
  }, [selected, sections])

  const move = (index: number, dir: -1 | 1) => {
    setSections((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const toggle = (index: number) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, enabled: !s.enabled } : s))
    )
  }

  const remove = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index))
    setSelected(-1)
  }

  const add = (type: string) => {
    setSections((prev) => [...prev, { type, enabled: true }])
  }

  const applyTemplate = (key: string) => {
    setSections(TEMPLATES[key].sections.map((s) => ({ ...s })))
  }

  const saveOptions = () => {
    try {
      const parsed = JSON.parse(optionsJson)
      setSections((prev) =>
        prev.map((s, i) => (i === selected ? { ...s, options: parsed } : s))
      )
      setError(null)
    } catch (e) {
      setError(`Options JSON invalides : ${(e as Error).message}`)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    setError(null)
    try {
      const next = { ...content }
      if (!next[locale]) next[locale] = {}
      next[locale].homePage = { sections }
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
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Page d&apos;accueil</h1>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        Configurez les sections de la page d&apos;accueil (inspiré de Shopify).
      </p>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: 600, marginRight: "0.5rem" }}>Langue :</label>
        <select
          value={locale}
          onChange={(e) => {
            setLocale(e.target.value)
            setSelected(-1)
          }}
          style={inputStyle as React.CSSProperties & { width: "auto" }}
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
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
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>Sections</label>
        {sections.length === 0 ? (
          <p>Aucune section. Ajoutez-en ci-dessous.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sections.map((section, index) => (
              <li
                key={`${section.type}-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.5rem",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                  background: selected === index ? "#f0f9ff" : "white",
                  cursor: "pointer",
                }}
                onClick={() => setSelected(index)}
              >
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggle(index)}
                />
                <span style={{ flex: 1 }}>{labelOf(section.type)}</span>
                <button onClick={(e) => { e.stopPropagation(); move(index, -1) }} style={iconBtn} disabled={index === 0}>↑</button>
                <button onClick={(e) => { e.stopPropagation(); move(index, 1) }} style={iconBtn} disabled={index === sections.length - 1}>↓</button>
                <button onClick={(e) => { e.stopPropagation(); remove(index) }} style={iconBtn}>✕</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected >= 0 && sections[selected] && (
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>
            Options ({labelOf(sections[selected].type)})
          </label>
          <textarea
            value={optionsJson}
            onChange={(e) => setOptionsJson(e.target.value)}
            rows={6}
            style={{ ...inputStyle, fontFamily: "monospace" }}
          />
          <button
            onClick={saveOptions}
            style={{
              marginTop: "0.5rem",
              padding: "0.4rem 1rem",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Appliquer les options
          </button>
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.25rem" }}>Ajouter une section</label>
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
  label: "Page d'accueil",
  rank: 7,
})

export default HomePage
