import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const ContentEditor = () => {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/content")
      .then((res) => res.json())
      .then((data) => {
        setContent(JSON.stringify(data.content ?? {}, null, 2))
      })
      .catch(() => setError("Impossible de charger le content.json"))
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    setError(null)

    try {
      const parsed = JSON.parse(content)
      const res = await fetch("/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: parsed }),
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

  return (
    <div style={{ padding: "2rem", maxWidth: "900px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Contenu client (content.json)
      </h1>
      <p style={{ marginBottom: "1rem", color: "#666" }}>
        Éditez le JSON ci-dessous pour personnaliser les textes, le SEO, les
        politiques, le marchand et les paramètres Google Merchant.
      </p>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          height: "60vh",
          fontFamily: "monospace",
          fontSize: "14px",
          padding: "1rem",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          marginBottom: "1rem",
        }}
      />
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

export const config = defineRouteConfig({
  label: "Contenu",
})

export default ContentEditor
