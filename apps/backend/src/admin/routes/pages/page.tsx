import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type Section = {
  type: string
  title?: string
  subtitle?: string
  text?: string
  image?: string
  ctaLabel?: string
  ctaHref?: string
  categoryHandle?: string
  limit?: number
}

type PageDef = { title?: string; sections: Section[] }
type Content = Record<string, { pages?: Record<string, PageDef> } & Record<string, unknown>>

const LOCALES = ["fr", "en"]
const SECTION_TYPES = ["hero", "text", "image", "cta", "products"] as const

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.4rem",
  fontSize: "13px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
}

const Pages = () => {
  const [content, setContent] = useState<Content>({})
  const [locale, setLocale] = useState("fr")
  const [selected, setSelected] = useState<string | null>(null)
  const [newSlug, setNewSlug] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = () => {
    fetch("/admin/content")
      .then((res) => res.json())
      .then((data) => setContent(data.content ?? {}))
      .catch(() => setError("Impossible de charger le contenu"))
  }

  useEffect(() => {
    load()
  }, [])

  const pages = content[locale]?.pages ?? {}
  const page = selected ? pages[selected] : null

  const updateContent = (next: Content) => setContent({ ...next })

  const setPage = (slug: string, def: PageDef | null) => {
    const next: Content = {
      ...content,
      [locale]: {
        ...(content[locale] ?? {}),
        pages: { ...pages },
      },
    }
    if (def === null) {
      delete next[locale].pages![slug]
      if (selected === slug) setSelected(null)
    } else {
      next[locale].pages![slug] = def
    }
    updateContent(next)
  }

  const addPage = () => {
    const slug = newSlug.trim().toLowerCase()
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError("Slug invalide (minuscules, chiffres, tirets)")
      return
    }
    setPage(slug, { title: slug, sections: [] })
    setSelected(slug)
    setNewSlug("")
    setError(null)
  }

  const updateSection = (index: number, patch: Partial<Section>) => {
    if (!selected || !page) return
    const sections = page.sections.map((s, i) =>
      i === index ? { ...s, ...patch } : s
    )
    setPage(selected, { ...page, sections })
  }

  const moveSection = (index: number, dir: -1 | 1) => {
    if (!selected || !page) return
    const target = index + dir
    if (target < 0 || target >= page.sections.length) return
    const sections = [...page.sections]
    const [item] = sections.splice(index, 1)
    sections.splice(target, 0, item)
    setPage(selected, { ...page, sections })
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch("/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Sauvegarde impossible")
      setNotice("Contenu sauvegardé.")
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const field = (
    label: string,
    value: string | undefined,
    onChange: (v: string) => void,
    textarea = false
  ) => (
    <div style={{ marginBottom: "0.5rem" }}>
      <label style={{ display: "block", fontSize: "12px", color: "#6b7280" }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={inputStyle}
        />
      ) : (
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  )

  return (
    <div style={{ padding: "2rem", maxWidth: "900px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Pages</h1>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        Page builder : composez des pages par blocs, servies sous{" "}
        <code>/&lt;locale&gt;/p/&lt;slug&gt;</code>.
      </p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
        <label htmlFor="pages-locale">Locale</label>
        <select
          id="pages-locale"
          value={locale}
          onChange={(e) => {
            setLocale(e.target.value)
            setSelected(null)
          }}
          style={inputStyle}
        >
          {LOCALES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: "0.4rem 1rem",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {saving ? "Sauvegarde…" : "Sauvegarder"}
        </button>
        {notice && <span style={{ color: "#16a34a" }}>{notice}</span>}
        {error && <span style={{ color: "#dc2626" }}>{error}</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1rem", marginBottom: "0.5rem" }}>Pages ({locale})</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {Object.keys(pages).map((slug) => (
              <li key={slug} style={{ marginBottom: "0.25rem" }}>
                <button
                  onClick={() => setSelected(slug)}
                  style={{
                    ...inputStyle,
                    textAlign: "left",
                    cursor: "pointer",
                    background: slug === selected ? "#e0f2fe" : "white",
                  }}
                >
                  /{slug}
                </button>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.75rem" }}>
            <input
              aria-label="Nouveau slug"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="a-propos"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button onClick={addPage} style={{ ...inputStyle, cursor: "pointer" }}>
              +
            </button>
          </div>
        </div>

        <div>
          {!page || !selected ? (
            <p style={{ color: "#6b7280" }}>Sélectionnez ou créez une page.</p>
          ) : (
            <div>
              {field(
                "Titre de la page",
                page.title,
                (v) => setPage(selected, { ...page, title: v })
              )}
              <h3 style={{ fontSize: "1rem", margin: "1rem 0 0.5rem" }}>
                Sections ({page.sections.length})
              </h3>
              {page.sections.map((section, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                    padding: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <strong>{section.type}</strong>
                    <span style={{ display: "flex", gap: "0.25rem" }}>
                      <button onClick={() => moveSection(i, -1)} aria-label="Monter" style={{ cursor: "pointer" }}>
                        ↑
                      </button>
                      <button onClick={() => moveSection(i, 1)} aria-label="Descendre" style={{ cursor: "pointer" }}>
                        ↓
                      </button>
                      <button
                        aria-label="Supprimer"
                        onClick={() =>
                          setPage(selected, {
                            ...page,
                            sections: page.sections.filter((_, j) => j !== i),
                          })
                        }
                        style={{ cursor: "pointer", color: "#b91c1c" }}
                      >
                        ✕
                      </button>
                    </span>
                  </div>
                  {field("Titre", section.title, (v) => updateSection(i, { title: v }))}
                  {(section.type === "hero" || section.type === "cta") &&
                    field("Sous-titre", section.subtitle, (v) =>
                      updateSection(i, { subtitle: v })
                    )}
                  {section.type === "text" &&
                    field("Texte", section.text, (v) => updateSection(i, { text: v }), true)}
                  {section.type === "image" &&
                    field("URL image", section.image, (v) => updateSection(i, { image: v }))}
                  {(section.type === "hero" || section.type === "cta") && (
                    <>
                      {field("Libellé CTA", section.ctaLabel, (v) =>
                        updateSection(i, { ctaLabel: v })
                      )}
                      {field("Lien CTA", section.ctaHref, (v) =>
                        updateSection(i, { ctaHref: v })
                      )}
                    </>
                  )}
                  {section.type === "products" && (
                    <>
                      {field("Handle de catégorie (optionnel)", section.categoryHandle, (v) =>
                        updateSection(i, { categoryHandle: v })
                      )}
                      {field("Limite", String(section.limit ?? ""), (v) =>
                        updateSection(i, { limit: Number(v) || undefined })
                      )}
                    </>
                  )}
                </div>
              ))}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <label htmlFor="new-section-type">Ajouter :</label>
                <select
                  id="new-section-type"
                  defaultValue=""
                  onChange={(e) => {
                    const type = e.target.value
                    if (!type || !selected || !page) return
                    setPage(selected, {
                      ...page,
                      sections: [...page.sections, { type }],
                    })
                    e.target.value = ""
                  }}
                  style={{ ...inputStyle, width: "auto" }}
                >
                  <option value="">— type —</option>
                  {SECTION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setPage(selected, null)}
                  style={{ ...inputStyle, width: "auto", color: "#b91c1c", cursor: "pointer" }}
                >
                  Supprimer la page
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Pages",
  rank: 10,
})

export default Pages
