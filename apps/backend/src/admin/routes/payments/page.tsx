import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

type Region = {
  id: string
  name: string
  currency_code: string
  payment_providers?: Array<{ id: string }>
}

type StripeStatus = {
  configured: boolean
  webhookConfigured: boolean
  hasPlaceholder: boolean
}

const PROVIDERS = [
  { id: "pp_stripe_stripe", label: "Stripe" },
  { id: "pp_system_default", label: "Paiement manuel" },
]

const cardStyle: React.CSSProperties = {
  padding: "1rem",
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  marginBottom: "1.5rem",
}

const Payments = () => {
  const [regions, setRegions] = useState<Region[]>([])
  const [stripe, setStripe] = useState<StripeStatus | null>(null)
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
        const regionsData = await r.json()
        const config = await c.json()
        const regions = regionsData.regions ?? []
        setRegions(regions)
        setStripe(config.stripe ?? null)
        const sel: Record<string, string[]> = {}
        for (const region of regions) {
          sel[region.id] = (region.payment_providers ?? []).map((p) => p.id)
        }
        setSelected(sel)
      })
      .catch(() => setError("Impossible de charger la configuration des paiements"))
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
        await fetch(`/admin/regions/${region.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_providers: selected[region.id] ?? [] }),
        })
      }
      setSaved(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Paiements</h1>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Statut Stripe</h2>
        {stripe ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ padding: "0.25rem 0" }}>
              Clé API :{" "}
              {stripe.configured
                ? "✅ configurée"
                : stripe.hasPlaceholder
                ? "⚠️ placeholder (test)"
                : "❌ non configurée"}
            </li>
            <li style={{ padding: "0.25rem 0" }}>
              Webhook : {stripe.webhookConfigured ? "✅ configuré" : "❌ non configuré"}
            </li>
          </ul>
        ) : (
          <p>Chargement…</p>
        )}
      </div>

      <div style={cardStyle}>
        <h2 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Providers par région</h2>
        {loading ? (
          <p>Chargement…</p>
        ) : regions.length === 0 ? (
          <p>Aucune région.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Région</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Devise</th>
                {PROVIDERS.map((p) => (
                  <th key={p.id} style={{ textAlign: "left", padding: "0.5rem" }}>
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr key={region.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "0.5rem" }}>{region.name}</td>
                  <td style={{ padding: "0.5rem" }}>{region.currency_code.toUpperCase()}</td>
                  {PROVIDERS.map((p) => (
                    <td key={p.id} style={{ padding: "0.5rem" }}>
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
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          style={{
            padding: "0.5rem 1.5rem",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
        {saved && <span style={{ color: "#16a34a" }}>Sauvegardé !</span>}
        {error && <span style={{ color: "#dc2626" }}>{error}</span>}
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Paiements",
  rank: 4,
})

export default Payments
