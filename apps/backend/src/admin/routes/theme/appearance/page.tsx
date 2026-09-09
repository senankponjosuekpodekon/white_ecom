import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const businessModels = [
  { value: "classic", label: "E-commerce classique" },
  { value: "dropshipping", label: "Dropshipping" },
  { value: "pod", label: "Print on Demand" },
  { value: "digital", label: "Produits numériques / Services" },
  { value: "subscription", label: "Abonnements" },
  { value: "b2b", label: "B2B / Vente en gros" },
  { value: "hybrid", label: "Hybride / Omnicanal" },
]

const defaultConfig = {
  name: "White Shop",
  primaryColor: "#3B82F6",
  logoUrl: "",
  font: "Inter",
  defaultLanguage: "fr",
  supportedLanguages: "fr,en",
  designPreset: "modern",
  siteUrl: "",
  businessModel: "classic",
  defaultCurrency: "eur",
  currencies: "eur",
  defaultCountry: "FR",
  defaultRegion: "EU",
}

const Onboarding = () => {
  const [form, setForm] = useState(defaultConfig)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/config")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Impossible de charger la configuration")
        }
        return res.json()
      })
      .then((data) => {
        const config = data.config ?? {}
        setForm({
          name: config.name ?? defaultConfig.name,
          primaryColor: config.primaryColor ?? defaultConfig.primaryColor,
          logoUrl: config.logoUrl ?? defaultConfig.logoUrl,
          font: config.font ?? defaultConfig.font,
          defaultLanguage: config.defaultLanguage ?? defaultConfig.defaultLanguage,
          supportedLanguages:
            Array.isArray(config.supportedLanguages)
              ? config.supportedLanguages.join(",")
              : config.supportedLanguages ?? defaultConfig.supportedLanguages,
          designPreset: config.designPreset ?? defaultConfig.designPreset,
          siteUrl: config.siteUrl ?? defaultConfig.siteUrl,
          businessModel: config.businessModel ?? defaultConfig.businessModel,
          defaultCurrency: config.defaultCurrency ?? defaultConfig.defaultCurrency,
          currencies:
            Array.isArray(config.currencies)
              ? config.currencies.join(",")
              : config.currencies ?? defaultConfig.currencies,
          defaultCountry: config.defaultCountry ?? defaultConfig.defaultCountry,
          defaultRegion: config.defaultRegion ?? defaultConfig.defaultRegion,
        })
      })
      .catch((err) => setError((err as Error).message))
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    setError(null)

    const payload = {
      name: form.name,
      primaryColor: form.primaryColor,
      logoUrl: form.logoUrl,
      font: form.font,
      defaultLanguage: form.defaultLanguage,
      supportedLanguages: form.supportedLanguages.split(",").map((s) => s.trim()),
      designPreset: form.designPreset,
      siteUrl: form.siteUrl,
      businessModel: form.businessModel,
      defaultCurrency: form.defaultCurrency,
      currencies: form.currencies.split(",").map((s) => s.trim()),
      defaultCountry: form.defaultCountry,
      defaultRegion: form.defaultRegion,
    }

    try {
      const res = await fetch("/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: payload }),
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
    <div style={{ padding: "2rem", maxWidth: "700px" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Apparence et marque
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#666" }}>
        Configurez l'identite de la boutique : nom, logo, couleurs, typographie, langues et URL.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Nom de la boutique
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            URL du logo
          </label>
          <input
            name="logoUrl"
            type="url"
            value={form.logoUrl}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Couleur principale
            </label>
            <input
              name="primaryColor"
              type="color"
              value={form.primaryColor}
              onChange={handleChange}
              style={{ ...inputStyle, height: "40px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Police
            </label>
            <select
              name="font"
              value={form.font}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Roboto">Roboto</option>
              <option value="Playfair Display">Playfair Display</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Langue par défaut
            </label>
            <select
              name="defaultLanguage"
              value={form.defaultLanguage}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Langues supportées (séparées par des virgules)
            </label>
            <input
              name="supportedLanguages"
              value={form.supportedLanguages}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Preset design
            </label>
            <select
              name="designPreset"
              value={form.designPreset}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="modern">Moderne</option>
              <option value="minimal">Minimal</option>
              <option value="corporate">Corporate</option>
              <option value="playful">Playful</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              URL publique du site
            </label>
            <input
              name="siteUrl"
              type="url"
              value={form.siteUrl}
              onChange={handleChange}
              placeholder="https://votre-boutique.com"
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
            Modèle économique
          </label>
          <select
            name="businessModel"
            value={form.businessModel}
            onChange={handleChange}
            style={inputStyle}
          >
            {businessModels.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <p style={{ fontSize: "12px", color: "#666", marginTop: "0.25rem" }}>
            Ce choix active ou désactive certaines fonctionnalités (livraison, stocks, abonnements, etc.).
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Devise par défaut
            </label>
            <select
              name="defaultCurrency"
              value={form.defaultCurrency}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="eur">EUR</option>
              <option value="usd">USD</option>
              <option value="gbp">GBP</option>
              <option value="xof">XOF</option>
              <option value="cad">CAD</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Devises supportées (séparées par des virgules)
            </label>
            <input
              name="currencies"
              value={form.currencies}
              onChange={handleChange}
              placeholder="eur,usd,gbp"
              style={inputStyle}
            />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Pays par défaut
            </label>
            <select
              name="defaultCountry"
              value={form.defaultCountry}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="FR">France</option>
              <option value="BE">Belgique</option>
              <option value="CH">Suisse</option>
              <option value="CA">Canada</option>
              <option value="US">États-Unis</option>
              <option value="CI">Côte d&apos;Ivoire</option>
              <option value="SN">Sénégal</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>
              Région fiscale / commerciale
            </label>
            <select
              name="defaultRegion"
              value={form.defaultRegion}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="EU">Union européenne</option>
              <option value="US">États-Unis / Amérique du Nord</option>
              <option value="AFRICA">Afrique UEMOA</option>
              <option value="UK">Royaume-Uni</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem" }}>
          <button
            type="submit"
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
            {loading ? "Sauvegarde..." : "Terminer l&apos;onboarding"}
          </button>
          {saved && <span style={{ color: "#16a34a" }}>Sauvegardé !</span>}
          {error && <span style={{ color: "#dc2626" }}>{error}</span>}
        </div>
      </form>
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
  label: "Apparence",
  rank: 1,
})

export default Onboarding
