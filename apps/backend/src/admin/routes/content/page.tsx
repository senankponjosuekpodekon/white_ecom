import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { defaultContent } from "../../../utils/default-content"

const locales = ["fr", "en"] as const
const sectionFields = [
  {
    name: "merchant",
    label: "Marchand",
    fields: [{ key: "brand", label: "Marque / Nom de la boutique" }],
  },
  {
    name: "site",
    label: "SEO",
    fields: [
      { key: "titleTemplate", label: "Titre du site" },
      { key: "description", label: "Description", textarea: true },
      { key: "keywords", label: "Mots-clés" },
    ],
  },
  {
    name: "hero",
    label: "Hero",
    fields: [
      { key: "title", label: "Titre" },
      { key: "subtitle", label: "Sous-titre", textarea: true },
      { key: "cta", label: "Texte du bouton" },
      { key: "image", label: "Image (URL)" },
    ],
  },
  {
    name: "cta",
    label: "Call to action",
    fields: [
      { key: "title", label: "Titre" },
      { key: "subtitle", label: "Sous-titre", textarea: true },
      { key: "button", label: "Texte du bouton" },
    ],
  },
  {
    name: "contact",
    label: "Contact",
    fields: [
      { key: "email", label: "Email" },
      { key: "phone", label: "Téléphone" },
      { key: "address", label: "Adresse" },
      { key: "hours", label: "Horaires" },
    ],
  },
  {
    name: "policies",
    label: "Politiques",
    fields: [
      { key: "shipping", label: "Livraison", textarea: true },
      { key: "returns", label: "Retours", textarea: true },
      { key: "privacy", label: "Confidentialité", textarea: true },
      { key: "legal", label: "Légal", textarea: true },
    ],
  },
  {
    name: "legal",
    label: "Mentions légales",
    fields: [
      { key: "mentions", label: "Mentions légales", textarea: true },
      { key: "terms", label: "CGV", textarea: true },
    ],
  },
  {
    name: "ads",
    label: "Tracking",
    fields: [
      { key: "gtagId", label: "Google Tag ID" },
      { key: "pixelId", label: "Facebook Pixel ID" },
    ],
  },
]

const ContentEditor = () => {
  const [content, setContent] = useState<Record<string, any>>(defaultContent)
  const [activeLocale, setActiveLocale] = useState<string>("fr")
  const [tab, setTab] = useState<"edit" | "preview">("edit")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(data.content ?? defaultContent)
      })
      .catch(() => setError("Impossible de charger le content.json"))
  }, [])

  const setString = (locale: string, section: string, key: string, value: string) => {
    setContent((prev) => {
      const next = { ...prev }
      if (!next[locale]) next[locale] = {}
      if (!next[locale][section]) next[locale][section] = {}
      next[locale][section][key] = value
      return next
    })
  }

  const setSiteUrl = (value: string) => {
    setContent((prev) => {
      const next = { ...prev }
      if (!next[activeLocale]) next[activeLocale] = {}
      next[activeLocale].siteUrl = value
      return next
    })
  }

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch("/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur lors de la sauvegarde")
      }
      setSaved(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const previewUrl =
    (content[activeLocale]?.siteUrl as string) ??
    (content[locales[0]]?.siteUrl as string) ??
    "http://localhost:8080"

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Contenu client
      </h1>
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        Éditez les textes, le SEO, les politiques et le tracking de la boutique.
      </p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setTab("edit")}
          style={{
            padding: "0.5rem 1rem",
            background: tab === "edit" ? "#111827" : "white",
            color: tab === "edit" ? "white" : "#111827",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Formulaire
        </button>
        <button
          onClick={() => setTab("preview")}
          style={{
            padding: "0.5rem 1rem",
            background: tab === "preview" ? "#111827" : "white",
            color: tab === "preview" ? "white" : "#111827",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Aperçu
        </button>
      </div>

      {tab === "edit" ? (
        <>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: 600, marginRight: "0.5rem" }}>Langue :</label>
            <select
              value={activeLocale}
              onChange={(e) => setActiveLocale(e.target.value)}
              style={{ padding: "0.5rem", border: "1px solid #e5e7eb", borderRadius: "6px" }}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            {sectionFields.map((section) => (
              <div
                key={section.name}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "1rem",
                  background: "white",
                }}
              >
                <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>{section.label}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {section.fields.map((field) => (
                    <div key={field.key}>
                      <label style={{ display: "block", fontSize: "14px", marginBottom: "0.25rem" }}>
                        {field.label}
                      </label>
                      {field.textarea ? (
                        <textarea
                          value={content[activeLocale]?.[section.name]?.[field.key] ?? ""}
                          onChange={(e) =>
                            setString(activeLocale, section.name, field.key, e.target.value)
                          }
                          rows={4}
                          style={inputStyle}
                        />
                      ) : (
                        <input
                          value={content[activeLocale]?.[section.name]?.[field.key] ?? ""}
                          onChange={(e) =>
                            setString(activeLocale, section.name, field.key, e.target.value)
                          }
                          style={inputStyle}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "1rem",
                background: "white",
              }}
            >
              <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>URL publique</h2>
              <input
                value={content[activeLocale]?.siteUrl ?? ""}
                onChange={(e) => setSiteUrl(e.target.value)}
                style={inputStyle}
                placeholder="https://votre-boutique.com"
              />
            </div>
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
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <input
              value={previewUrl}
              onChange={() => {}}
              style={{ ...inputStyle, flex: 1 }}
              readOnly
            />
            <button
              onClick={() => {
                const iframe = document.getElementById("preview-frame") as HTMLIFrameElement
                if (iframe) iframe.src = iframe.src
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "#111827",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Rafraîchir
            </button>
          </div>
          <iframe
            id="preview-frame"
            src={previewUrl}
            style={{ width: "100%", height: "70vh", border: "1px solid #e5e7eb", borderRadius: "8px" }}
          />
        </div>
      )}
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
  label: "Contenu",
})

export default ContentEditor
