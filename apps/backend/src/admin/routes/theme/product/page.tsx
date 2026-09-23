import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"

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

const selectClass = "p-2 text-sm border border-gray-200 rounded-md"

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
      const a = next[index]
      next[index] = next[target]
      next[target] = a
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
    <Container className="p-6" style={{ maxWidth: "900px" }}>
      <Heading level="h1">Page produit</Heading>
      <Text className="text-ui-fg-subtle mt-1 mb-6">
        Configurez les blocs affichés sur la fiche produit (inspiré de Shopify).
      </Text>

      <div className="mb-6">
        <label className="font-medium mr-2">Langue :</label>
        <select value={locale} onChange={(e) => setLocale(e.target.value)} className={selectClass}>
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      <Container className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
        <Heading level="h2" className="text-base mb-3">
          Layout
        </Heading>
        <select value={layout} onChange={(e) => setLayout(e.target.value)} className={selectClass}>
          <option value="split">Split (média à gauche)</option>
          <option value="stacked">Empilé (média au-dessus)</option>
          <option value="slider">Slider (média pleine largeur)</option>
        </select>
      </Container>

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
          Blocs
        </Heading>
        {blocks.length === 0 ? (
          <Text>Aucun bloc. Ajoutez-en ci-dessous.</Text>
        ) : (
          <ul className="space-y-2">
            {blocks.map((block, index) => (
              <li
                key={`${block.type}-${index}`}
                className="flex items-center gap-3 p-2 border border-gray-200 rounded-md bg-white"
              >
                <input
                  type="checkbox"
                  checked={block.enabled}
                  onChange={() => toggle(index)}
                />
                <span className="flex-1 text-sm">{labelOf(block.type)}</span>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => move(index, 1)}
                  disabled={index === blocks.length - 1}
                >
                  ↓
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => remove(index)}
                >
                  x
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Container>

      <Container className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
        <Heading level="h2" className="text-base mb-3">
          Ajouter un bloc
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
  label: "Page produit",
  rank: 3,
})

export default ProductPage
