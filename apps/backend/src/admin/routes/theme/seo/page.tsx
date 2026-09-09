import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"

const locales = ["fr", "en"] as const

const defaultSite = {
  description: "",
  keywords: "",
  titleTemplate: "%s",
}

const SeoSettings = () => {
  const navigate = useNavigate()
  const [content, setContent] = useState<Record<string, any>>({})
  const [activeLocale, setActiveLocale] = useState<string>("fr")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch("/admin/content")
      .then((res) => (res.ok ? res.json() : Promise.reject("Erreur de chargement")))
      .then((data) => {
        setContent(data.content ?? {})
      })
      .catch(() => setError("Impossible de charger le contenu"))
      .finally(() => setLoading(false))
  }, [])

  const site = (content[activeLocale]?.site ?? defaultSite) as {
    description?: string
    keywords?: string
    titleTemplate?: string
  }

  const setSiteField = (field: string, value: string) => {
    setContent((prev) => {
      const next = { ...prev }
      if (!next[activeLocale]) next[activeLocale] = {}
      next[activeLocale] = {
        ...next[activeLocale],
        site: { ...next[activeLocale].site, [field]: value },
      }
      return next
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
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
      setSaving(false)
    }
  }

  const styles = {
    label: { display: "block", marginBottom: "0.25rem", fontWeight: 500 } as React.CSSProperties,
    input: {
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      marginBottom: "1rem",
    } as React.CSSProperties,
    textarea: {
      width: "100%",
      padding: "0.5rem",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      minHeight: "80px",
      marginBottom: "1rem",
    } as React.CSSProperties,
  }

  if (loading) {
    return (
      <Container className="p-6">
        <Text>Chargement...</Text>
      </Container>
    )
  }

  return (
    <Container className="p-6" style={{ maxWidth: "700px" }}>
      <div className="mb-4">
        <Heading level="h1">SEO global</Heading>
        <Text className="text-ui-fg-subtle mt-1">
          Balises meta, title template et mots-clés par langue.
        </Text>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={styles.label}>Langue</label>
        <select
          value={activeLocale}
          onChange={(e) => setActiveLocale(e.target.value)}
          style={styles.input}
        >
          {locales.map((l) => (
            <option key={l} value={l}>
              {l === "fr" ? "Français" : "English"}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSave}>
        <label style={styles.label}>Title template</label>
        <input
          style={styles.input}
          value={site.titleTemplate ?? "%s"}
          onChange={(e) => setSiteField("titleTemplate", e.target.value)}
          placeholder="%s | White Shop"
        />

        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          value={site.description ?? ""}
          onChange={(e) => setSiteField("description", e.target.value)}
          placeholder="Description du site affichée dans les moteurs de recherche."
        />

        <label style={styles.label}>Mots-clés</label>
        <input
          style={styles.input}
          value={site.keywords ?? ""}
          onChange={(e) => setSiteField("keywords", e.target.value)}
          placeholder="boutique, e-commerce, produits"
        />

        <div className="flex items-center gap-2">
          <Button type="submit" variant="primary" isLoading={saving}>
            Enregistrer
          </Button>
          <Button variant="secondary" type="button" onClick={() => navigate("/theme")}>
            Retour
          </Button>
        </div>

        {saved && <Text className="text-emerald-600 mt-2">Enregistré.</Text>}
        {error && <Text className="text-red-600 mt-2">{error}</Text>}
      </form>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "SEO",
  rank: 6,
})

export default SeoSettings
