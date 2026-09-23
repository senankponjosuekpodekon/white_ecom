import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"

type Region = {
  id: string
  name: string
  currency_code: string
  payment_providers?: Array<{ id: string }>
}

type Provider = {
  id: string
  label: string
}

type PaymentConfig = {
  stripe: {
    configured: boolean
    webhookConfigured: boolean
    hasPlaceholder: boolean
  }
  providers?: Provider[]
}

const Payments = () => {
  const [regions, setRegions] = useState<Region[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [stripe, setStripe] = useState<PaymentConfig["stripe"] | null>(null)
  const [selected, setSelected] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/admin/regions?fields=id,name,currency_code,payment_providers.id"),
      fetch("/admin/payment-config"),
    ])
      .then(async ([r, c]) => {
        if (!r.ok || !c.ok) {
          throw new Error("Impossible de charger la configuration des paiements")
        }
        const regionsData = await r.json()
        const config: PaymentConfig = await c.json()
        const regions = regionsData.regions ?? []
        setRegions(regions)
        setProviders(config.providers ?? [])
        setStripe(config.stripe ?? null)
        const sel: Record<string, string[]> = {}
        for (const region of regions) {
          sel[region.id] = (region.payment_providers ?? []).map((p) => p.id)
        }
        setSelected(sel)
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const toggle = (regionId: string, providerId: string) => {
    setSelected((prev) => {
      const current = prev[regionId] ?? []
      const next = current.includes(providerId)
        ? current.filter((p) => p !== providerId)
        : [...current, providerId]
      return { ...prev, [regionId]: next }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      for (const region of regions) {
        const res = await fetch(`/admin/regions/${region.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_providers: selected[region.id] ?? [] }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.message ?? `Erreur region ${region.name}`)
        }
      }
      setSaved(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="p-6" style={{ maxWidth: "900px" }}>
      <Heading level="h1">Paiements</Heading>
      <Text className="text-ui-fg-subtle mt-1 mb-6">
        Configurez Stripe et les providers actifs par région.
      </Text>

      <Container className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
        <Heading level="h2" className="text-base mb-2">
          Statut Stripe
        </Heading>
        {stripe ? (
          <div className="space-y-1">
            <Text className="text-sm">
              Clé API : {" "}
              {stripe.configured
                ? "configurée"
                : stripe.hasPlaceholder
                ? "placeholder (test)"
                : "non configurée"}
            </Text>
            <Text className="text-sm">
              Webhook : {stripe.webhookConfigured ? "configuré" : "non configuré"}
            </Text>
          </div>
        ) : (
          <Text>Chargement…</Text>
        )}
      </Container>

      <Container className="p-4 bg-white border border-gray-200 rounded-lg mb-4">
        <Heading level="h2" className="text-base mb-4">
          Providers par région
        </Heading>
        {loading ? (
          <Text>Chargement…</Text>
        ) : regions.length === 0 ? (
          <Text>Aucune région.</Text>
        ) : providers.length === 0 ? (
          <Text>Aucun provider disponible.</Text>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-4 font-medium text-sm">Région</th>
                <th className="py-2 pr-4 font-medium text-sm">Devise</th>
                {providers.map((p) => (
                  <th key={p.id} className="py-2 pr-4 font-medium text-sm">
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr key={region.id} className="border-b border-gray-200 last:border-0">
                  <td className="py-2 pr-4 text-sm">{region.name}</td>
                  <td className="py-2 pr-4 text-sm">{region.currency_code.toUpperCase()}</td>
                  {providers.map((p) => (
                    <td key={p.id} className="py-2 pr-4">
                      <input
                        type="checkbox"
                        checked={(selected[region.id] ?? []).includes(p.id)}
                        onChange={() => toggle(region.id, p.id)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Container>

      <div className="flex items-center gap-4">
        <Button
          variant="primary"
          isLoading={saving}
          disabled={loading}
          onClick={handleSave}
        >
          Sauvegarder
        </Button>
        {saved && <Text className="text-emerald-600">Sauvegardé !</Text>}
        {error && <Text className="text-red-600">{error}</Text>}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Paiements",
  rank: 7,
})

export default Payments
