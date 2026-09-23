import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"

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

const selectClass = "p-2 text-sm border border-gray-200 rounded-md"
const fieldClass = "w-full p-2 text-sm border border-gray-200 rounded-md font-mono"

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
      const a = next[index]
      next[index] = next[target]
      next[target] = a
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
    <Container className="p-6" style={{ maxWidth: "900px" }}>
      <Heading level="h1">Page d&apos;accueil</Heading>
      <Text className="text-ui-fg-subtle mt-1 mb-6">
        Configurez les sections de la page d&apos;accueil (inspiré de Shopify).
      </Text>

      <div className="mb-6">
        <label className="font-medium mr-2">Langue :</label>
        <select
          value={locale}
          onChange={(e) => {
            setLocale(e.target.value)
            setSelected(-1)
          }}
          className={selectClass}
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      <Container className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
        <Heading level="h2" className="text-base mb-3">
          Templates
        </Heading>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(TEMPLATES).map(([key, tpl]) => (
            <Button key={key} variant="secondary" onClick={() => applyTemplate(key)}>
              {tpl.label}
            </Button>
          ))}
        </div>
      </Container>

      <Container className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
        <Heading level="h2" className="text-base mb-3">
          Sections
        </Heading>
        {sections.length === 0 ? (
          <Text>Aucune section. Ajoutez-en ci-dessous.</Text>
        ) : (
          <ul className="space-y-2">
            {sections.map((section, index) => (
              <li
                key={`${section.type}-${index}`}
                className={`flex items-center gap-3 p-2 border border-gray-200 rounded-md cursor-pointer ${
                  selected === index ? "bg-blue-50" : "bg-white"
                }`}
                onClick={() => setSelected(index)}
              >
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggle(index)}
                />
                <span className="flex-1 text-sm">{labelOf(section.type)}</span>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); move(index, -1) }}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); move(index, 1) }}
                  disabled={index === sections.length - 1}
                >
                  ↓
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); remove(index) }}
                >
                  x
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Container>

      {selected >= 0 && sections[selected] && (
        <Container className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
          <Heading level="h2" className="text-base mb-3">
            Options ({labelOf(sections[selected].type)})
          </Heading>
          <textarea
            value={optionsJson}
            onChange={(e) => setOptionsJson(e.target.value)}
            rows={6}
            className={fieldClass}
          />
          <Button
            variant="secondary"
            className="mt-2"
            onClick={saveOptions}
          >
            Appliquer les options
          </Button>
        </Container>
      )}

      <Container className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
        <Heading level="h2" className="text-base mb-3">
          Ajouter une section
        </Heading>
        <select
          onChange={(e) => {
            if (e.target.value) add(e.target.value)
            e.target.value = ""
          }}
          className={selectClass}
          defaultValue=""
        >
          <option value="">— Choisir —</option>
          {CATALOG.map((c) => (
            <option key={c.type} value={c.type}>
              {c.label}
            </option>
          ))}
        </select>
      </Container>

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
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Page d'accueil",
  rank: 2,
})

export default HomePage
