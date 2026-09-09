import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"

const sections = [
  {
    label: "Apparence",
    path: "/theme/appearance",
    description: "Marque, couleurs, typographie, logo et langues.",
    rank: 1,
  },
  {
    label: "Page d'accueil",
    path: "/theme/home",
    description: "Sections et templates de la page d'accueil.",
    rank: 2,
  },
  {
    label: "Page produit",
    path: "/theme/product",
    description: "Blocs, mise en page et templates fiche produit.",
    rank: 3,
  },
  {
    label: "Contenu & Pages",
    path: "/theme/content",
    description: "Hero, CTA, politiques, contact, mentions légales.",
    rank: 4,
  },
  {
    label: "Navigation",
    path: "/theme/navigation",
    description: "Menus header, footer et liens rapides.",
    rank: 5,
  },
  {
    label: "SEO",
    path: "/theme/seo",
    description: "Titre du site, description, robots et sitemap.",
    rank: 6,
  },
  {
    label: "Paiements",
    path: "/theme/payments",
    description: "Providers de paiement par région.",
    rank: 7,
  },
  {
    label: "Assistant IA",
    path: "/theme/ai",
    description: "Génération de contenu, descriptions, SEO et traductions.",
    rank: 8,
  },
]

const ThemeDashboard = () => {
  const navigate = useNavigate()

  return (
    <Container className="p-6">
      <div className="mb-6">
        <Heading level="h1">Boutique en ligne</Heading>
        <Text className="text-ui-fg-subtle mt-2">
          Personnalisez l'apparence, le contenu et les réglages de la boutique.
        </Text>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {sections.map((section) => (
          <Container
            key={section.path}
            className="p-4 flex flex-col justify-between"
            style={{ minHeight: "140px" }}
          >
            <div>
              <Heading level="h3" className="text-base font-semibold">
                {section.label}
              </Heading>
              <Text className="text-ui-fg-subtle text-sm mt-1">
                {section.description}
              </Text>
            </div>
            <Button
              variant="secondary"
              className="mt-4 w-full justify-center"
              onClick={() => navigate(section.path)}
            >
              Ouvrir
            </Button>
          </Container>
        ))}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Boutique en ligne",
  rank: 3,
})

export default ThemeDashboard
