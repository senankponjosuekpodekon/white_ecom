import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"

const quickPrompts = [
  {
    label: "Description produit",
    system:
      "Tu es un redacteur e-commerce. Redige une description produit courte, vendeuse et SEO-friendly en francais.",
    prompt:
      "Titre : .\nCaracteristiques : .\nRedige une description produit de 3 paragraphes.",
  },
  {
    label: "SEO produit",
    system:
      "Tu es un expert SEO e-commerce. Propose un meta title, une meta description et 5 mots-cles.",
    prompt:
      "Produit : .\nDonne un JSON avec metaTitle (max 60 caracteres), metaDescription (max 160 caracteres) et keywords.",
  },
  {
    label: "Traduction EN",
    system:
      "Tu es un traducteur professionnel. Traduis le texte suivant de francais vers anglais en conservant le ton.",
    prompt: "Texte a traduire : ",
  },
  {
    label: "Slogan accueil",
    system: "Tu es un copywriter. Genere un slogan court pour une boutique en ligne.",
    prompt:
      "Boutique : .\nProduits : .\nGenere 3 slogans accrocheurs de moins de 10 mots.",
  },
]

const AiAssistant = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<{ provider: string; configured: boolean } | null>(null)
  const [prompt, setPrompt] = useState("")
  const [system, setSystem] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/admin/ai")
      .then((res) => (res.ok ? res.json() : Promise.reject("Erreur")))
      .then(setStatus)
      .catch(() => setStatus({ provider: "none", configured: false }))
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    setResult("")
    try {
      const res = await fetch("/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, system }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "Erreur de generation")
      }
      setResult(data.text)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const applyQuick = (index: number) => {
    setSystem(quickPrompts[index].system)
    setPrompt(quickPrompts[index].prompt)
    setResult("")
  }

  const copy = () => {
    navigator.clipboard.writeText(result).catch(() => {})
  }

  const statusColor = status?.configured ? "text-emerald-600" : "text-red-600"

  return (
    <Container className="p-6" style={{ maxWidth: "900px" }}>
      <div className="mb-4">
        <Heading level="h1">Assistant IA</Heading>
        <Text className="text-ui-fg-subtle mt-1">
          Generez du contenu pour vos produits, votre SEO et vos traductions.
        </Text>
      </div>

      {status && (
        <div className={`mb-4 ${statusColor}`}>
          <Text>
            Fournisseur : {status.provider} —{" "}
            {status.configured ? "configure" : "non configure"}
          </Text>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {quickPrompts.map((q, i) => (
          <Button key={q.label} variant="secondary" onClick={() => applyQuick(i)}>
            {q.label}
          </Button>
        ))}
      </div>

      <div className="mb-4">
        <label style={{ fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
          System prompt (optionnel)
        </label>
        <textarea
          value={system}
          onChange={(e) => setSystem(e.target.value)}
          rows={2}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
          }}
        />
      </div>

      <div className="mb-4">
        <label style={{ fontWeight: 500, display: "block", marginBottom: "0.25rem" }}>
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={6}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
          }}
        />
      </div>

      <div className="flex gap-2 mb-6">
        <Button variant="primary" isLoading={loading} onClick={handleGenerate}>
          Generer
        </Button>
        <Button variant="secondary" onClick={() => navigate("/theme")}>
          Retour
        </Button>
      </div>

      {error && <Text className="text-red-600 mb-4">{error}</Text>}

      {result && (
        <Container className="p-4" style={{ background: "#f9fafb" }}>
          <div className="flex justify-between items-center mb-2">
            <Heading level="h3" className="text-base">
              Resultat
            </Heading>
            <Button variant="secondary" size="small" onClick={copy}>
              Copier
            </Button>
          </div>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            {result}
          </pre>
        </Container>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Assistant IA",
  rank: 8,
})

export default AiAssistant
