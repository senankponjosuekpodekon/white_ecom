import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"
import { defaultContent } from "../../../../utils/default-content"

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

const fieldClass = "w-full p-2 text-sm border border-gray-200 rounded-md"

const ContentEditor = () => {
  const [content, setContent] = useState<Record<string, any>>(defaultContent as Record<string, any>)
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
    <Container className="p-6" style={{ maxWidth: "1100px" }}>
      <Heading level="h1">Contenu & Pages</Heading>
      <Text className="text-ui-fg-subtle mt-1 mb-6">
        Éditez les textes, le SEO, les politiques et le tracking de la boutique.
      </Text>

      <div className="flex gap-2 mb-6">
        <Button
          variant={tab === "edit" ? "primary" : "secondary"}
          onClick={() => setTab("edit")}
        >
          Formulaire
        </Button>
        <Button
          variant={tab === "preview" ? "primary" : "secondary"}
          onClick={() => setTab("preview")}
        >
          Aperçu
        </Button>
      </div>

      {tab === "edit" ? (
        <>
          <div className="mb-6">
            <label className="font-medium mr-2">Langue :</label>
            <select
              value={activeLocale}
              onChange={(e) => setActiveLocale(e.target.value)}
              className="p-2 text-sm border border-gray-200 rounded-md"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {sectionFields.map((section) => (
              <Container
                key={section.name}
                className="p-4 bg-white border border-gray-200 rounded-lg"
              >
                <Heading level="h2" className="text-base mb-3">
                  {section.label}
                </Heading>
                <div className="flex flex-col gap-3">
                  {section.fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm mb-1">
                        {field.label}
                      </label>
                      {field.textarea ? (
                        <textarea
                          value={content[activeLocale]?.[section.name]?.[field.key] ?? ""}
                          onChange={(e) =>
                            setString(activeLocale, section.name, field.key, e.target.value)
                          }
                          rows={4}
                          className={fieldClass}
                        />
                      ) : (
                        <input
                          value={content[activeLocale]?.[section.name]?.[field.key] ?? ""}
                          onChange={(e) =>
                            setString(activeLocale, section.name, field.key, e.target.value)
                          }
                          className={fieldClass}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Container>
            ))}

            <Container className="p-4 bg-white border border-gray-200 rounded-lg">
              <Heading level="h2" className="text-base mb-3">
                URL publique
              </Heading>
              <input
                value={content[activeLocale]?.siteUrl ?? ""}
                onChange={(e) => setSiteUrl(e.target.value)}
                className={fieldClass}
                placeholder="https://votre-boutique.com"
              />
            </Container>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              isLoading={loading}
              onClick={handleSave}
            >
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
            {saved && <Text className="text-emerald-600">Sauvegardé !</Text>}
            {error && <Text className="text-red-600">{error}</Text>}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              value={previewUrl}
              onChange={() => {}}
              className={fieldClass}
              readOnly
            />
            <Button
              variant="secondary"
              onClick={() => {
                const iframe = document.getElementById("preview-frame") as HTMLIFrameElement
                if (iframe) iframe.src = iframe.src
              }}
            >
              Rafraîchir
            </Button>
          </div>
          <iframe
            id="preview-frame"
            src={previewUrl}
            style={{ width: "100%", height: "70vh", border: "1px solid #e5e7eb", borderRadius: "8px" }}
          />
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Contenu & Pages",
  rank: 4,
})

export default ContentEditor
