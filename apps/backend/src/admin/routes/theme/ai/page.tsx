import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"

const AiAssistant = () => {
  const navigate = useNavigate()

  return (
    <Container className="p-6" style={{ maxWidth: "700px" }}>
      <Heading level="h1">Assistant IA</Heading>
      <Text className="text-ui-fg-subtle mt-2">
        Outils d'IA pour accélérer la gestion de la boutique.
      </Text>

      <ul style={{ marginTop: "1rem", lineHeight: 1.6 }}>
        <li>Generer ou reecrire les descriptions produit</li>
        <li>Proposer des titres SEO, meta descriptions et mots-cles</li>
        <li>Traduire automatiquement les fiches produit et le contenu</li>
        <li>Suggerer des categories et collections</li>
      </ul>

      <Text className="text-ui-fg-subtle mt-4">
        Ces fonctionnalites seront branchees dans une prochaine etape avec un
        fournisseur d'IA au choix (OpenAI, Cloudflare Workers AI, etc.).
      </Text>

      <div className="mt-6">
        <Button variant="secondary" onClick={() => navigate("/theme")}>
          Retour
        </Button>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Assistant IA",
  rank: 8,
})

export default AiAssistant
