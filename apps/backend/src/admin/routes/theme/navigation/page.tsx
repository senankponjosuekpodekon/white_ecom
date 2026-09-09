import { useNavigate } from "react-router-dom"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button } from "@medusajs/ui"

const NavigationSettings = () => {
  const navigate = useNavigate()

  return (
    <Container className="p-6" style={{ maxWidth: "700px" }}>
      <Heading level="h1">Navigation</Heading>
      <Text className="text-ui-fg-subtle mt-2">
        L'éditeur de menus (header et footer) sera disponible ici prochainement.
        Les liens du footer sont actuellement gérés dans Contenu & Pages.
      </Text>

      <div className="mt-6 flex gap-2">
        <Button variant="secondary" onClick={() => navigate("/theme/content")}>
          Ouvrir Contenu & Pages
        </Button>
        <Button variant="secondary" onClick={() => navigate("/theme")}>
          Retour
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
