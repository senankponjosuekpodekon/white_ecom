import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Input, Label } from "@medusajs/ui"
import { defaultContent } from "../../../../utils/default-content"

const locales = ["fr", "en"] as const

type NavItem = { label: string; href: string }

const NavigationSettings = () => {
  const navigate = useNavigate()
  const [content, setContent] = useState<Record<string, any>>(defaultContent as Record<string, any>)
  const [locale, setLocale] = useState<string>("fr")
  const [items, setItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/admin/content")
      .then((res) => res.json())
      .then((data) => {
        const c = data.content ?? defaultContent
        setContent(c)
        setItems(c[locale]?.nav?.items ?? [])
      })
      .catch(() => setError("Impossible de charger le contenu"))
      .finally(() => setLoading(false))
  }, [])

  const switchLocale = (next: string) => {
    setLocale(next)
    setItems(content[next]?.nav?.items ?? [])
  }

  const updateItem = (index: number, patch: Partial<NavItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    )
  }

  const moveItem = (index: number, dir: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const next = {
        ...content,
        [locale]: {
          ...(content[locale] ?? {}),
          nav: { items: items.filter((i) => i.label && i.href) },
        },
      }
      const res = await fetch("/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: next }),
      })
      if (!res.ok) throw new Error("save failed")
      setContent(next)
      setSaved(true)
    } catch {
      setError("Enregistrement impossible")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Container className="p-6" style={{ maxWidth: "700px" }}>
        <Text className="text-ui-fg-subtle">Chargement…</Text>
      </Container>
    )
  }

  return (
    <Container className="p-6" style={{ maxWidth: "700px" }}>
      <Heading level="h1">Navigation</Heading>
      <Text className="text-ui-fg-subtle mt-2">
        Liens du menu principal du storefront. Si la liste est vide, le lien
        Catalogue par défaut est affiché. Panier, compte et connexion restent
        toujours visibles.
      </Text>

      <div className="mt-6 flex gap-2">
        {locales.map((l) => (
          <Button
            key={l}
            variant={locale === l ? "primary" : "secondary"}
            onClick={() => switchLocale(l)}
          >
            {l.toUpperCase()}
          </Button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-end gap-2 border border-ui-border-base rounded-lg p-3"
          >
            <div className="flex-1">
              <Label>Libellé</Label>
              <Input
                value={item.label}
                onChange={(e) => updateItem(i, { label: e.target.value })}
                placeholder="Catalogue"
              />
            </div>
            <div className="flex-1">
              <Label>Lien</Label>
              <Input
                value={item.href}
                onChange={(e) => updateItem(i, { href: e.target.value })}
                placeholder="/fr/products"
              />
            </div>
            <div className="flex gap-1">
              <Button variant="secondary" onClick={() => moveItem(i, -1)}>
                ↑
              </Button>
              <Button variant="secondary" onClick={() => moveItem(i, 1)}>
                ↓
              </Button>
              <Button
                variant="danger"
                onClick={() => setItems((prev) => prev.filter((_, x) => x !== i))}
              >
                ×
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="secondary"
          onClick={() => setItems((prev) => [...prev, { label: "", href: "" }])}
        >
          Ajouter un lien
        </Button>
      </div>

      {error && <Text className="text-ui-fg-error mt-4">{error}</Text>}
      {saved && (
        <Text className="text-ui-fg-subtle mt-4">Enregistré.</Text>
      )}

      <div className="mt-6 flex gap-2">
        <Button variant="primary" isLoading={saving} onClick={save}>
          Enregistrer
        </Button>
        <Button variant="secondary" onClick={() => navigate("/theme/content")}>
          Contenu & Pages
        </Button>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Navigation",
  rank: 5,
})

export default NavigationSettings
