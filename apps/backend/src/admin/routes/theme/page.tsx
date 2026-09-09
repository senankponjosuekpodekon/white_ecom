import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"
import type { MinimogSection } from "../../../utils/default-content"

type ThemeData = {
  minimog: {
    sections: MinimogSection[]
    sectionOrder: string[]
  }
}

const ThemeEditor = () => {
  const navigate = useNavigate()
  const [sections, setSections] = useState<MinimogSection[]>([])
  const [sectionOrder, setSectionOrder] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch("/admin/theme/sections?locale=fr")
      .then((res) => (res.ok ? res.json() : Promise.reject("Erreur de chargement")))
      .then((data: ThemeData) => {
        const ordered = (data.minimog.sectionOrder ?? data.minimog.sections.map((s) => s.id) ?? [])
        setSectionOrder(ordered)
        const sectionMap = new Map(data.minimog.sections.map((s) => [s.id, s]))
        setSections(ordered.map((id) => sectionMap.get(id)!).filter(Boolean))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message ?? String(err))
        setLoading(false)
      })
  }, [])

  const updateSection = (index: number, patch: Partial<MinimogSection>) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  const updateSettings = (index: number, raw: string) => {
    try {
      const parsed = JSON.parse(raw)
      updateSection(index, { settings: parsed })
      setError(null)
    } catch {
      // silently ignore while typing; validate on save
    }
  }

  const move = (index: number, dir: -1 | 1) => {
    if (index + dir < 0 || index + dir >= sections.length) return
    setSections((prev) => {
      const next = [...prev]
      ;[next[index], next[index + dir]] = [next[index + dir], next[index]]
      setSectionOrder(next.map((s) => s.id))
      return next
    })
  }

  const save = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      for (const s of sections) {
        if (!s.id || !s.type) throw new Error(`Section invalide : ${JSON.stringify(s)}`)
      }
      const res = await fetch("/admin/theme/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: "fr",
          minimog: { sections, sectionOrder: sections.map((s) => s.id) },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la sauvegarde")
      setSuccess(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="p-6" style={{ maxWidth: "1100px" }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Heading level="h1">Thème / Boutique en ligne</Heading>
          <Text className="text-ui-fg-subtle mt-1">
            Activez, désactivez, réordonnez et personnalisez les sections de la page d’accueil Minimog.
          </Text>
        </div>
        <Button variant="secondary" onClick={() => navigate("/theme/ai")}>
          Assistant IA
        </Button>
      </div>

      {loading && <Text>Chargement...</Text>}

      {!loading && (
        <>
          <div className="flex gap-2 mb-4">
            <Button variant="primary" isLoading={saving} onClick={save}>
              Sauvegarder
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                setSections((prev) => [
                  ...prev,
                  {
                    id: `section-${Date.now()}`,
                    type: "placeholder",
                    enabled: true,
                    settings: {},
                  },
                ])
              }
            >
              Ajouter une section
            </Button>
          </div>

          {error && <Text className="text-red-600 mb-4">{error}</Text>}
          {success && <Text className="text-emerald-600 mb-4">Sauvegarde réussie.</Text>}

          <div className="space-y-4">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-ui-fg-subtle">ID</label>
                    <input
                      value={section.id}
                      onChange={(e) => updateSection(index, { id: e.target.value })}
                      className="w-full mt-1 px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-ui-fg-subtle">Type</label>
                    <select
                      value={section.type}
                      onChange={(e) => updateSection(index, { type: e.target.value })}
                      className="w-full mt-1 px-2 py-1 border rounded bg-white"
                    >
                      <option value="header">Header</option>
                      <option value="slider">Slider</option>
                      <option value="banner-with-slider">Banner with slider</option>
                      <option value="featured-collection">Featured collection</option>
                      <option value="scrolling-promotion">Scrolling promotion</option>
                      <option value="footer">Footer</option>
                      <option value="placeholder">Placeholder</option>
                    </select>
                  </div>
                  <div className="col-span-1">
                    <label className="text-sm font-medium text-ui-fg-subtle">Actif</label>
                    <input
                      type="checkbox"
                      checked={section.enabled !== false}
                      onChange={(e) => updateSection(index, { enabled: e.target.checked })}
                      className="mt-2 w-5 h-5"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-ui-fg-subtle">Design</label>
                    <input
                      value={section.design ?? ""}
                      onChange={(e) => updateSection(index, { design: e.target.value })}
                      placeholder="ex: default, slider"
                      className="w-full mt-1 px-2 py-1 border rounded"
                    />
                  </div>
                  <div className="col-span-5">
                    <label className="text-sm font-medium text-ui-fg-subtle">Settings (JSON)</label>
                    <textarea
                      value={JSON.stringify(section.settings ?? {}, null, 2)}
                      onChange={(e) => updateSettings(index, e.target.value)}
                      rows={4}
                      className="w-full mt-1 px-2 py-1 border rounded font-mono text-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
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
                    disabled={index === sections.length - 1}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() =>
                      setSections((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Thème",
  rank: 5,
})

export default ThemeEditor
