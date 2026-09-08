import fs from "fs"
import path from "path"
import { MedusaError } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { defaultContent } from "../utils/default-content"

const clientsDir = path.resolve(process.cwd(), "clients")

const defaultConfig = {
  name: "White Shop",
  primaryColor: "#3B82F6",
  logoUrl: "",
  font: "Inter",
  defaultLanguage: "fr",
  supportedLanguages: ["fr"],
  designPreset: "modern",
  siteUrl: "",
  businessModel: "classic",
  defaultCurrency: "eur",
  currencies: ["eur"],
  defaultCountry: "FR",
  defaultRegion: "EU",
}

const createClientStep = createStep(
  "create-client",
  async (input: { name: string }) => {
    if (!/^[a-z0-9-]+$/.test(input.name)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Client name must contain only lowercase letters, digits and dashes"
      )
    }
    const clientDir = path.resolve(clientsDir, input.name)
    if (!clientDir.startsWith(clientsDir + path.sep)) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid client path")
    }
    fs.mkdirSync(clientDir, { recursive: true })
    fs.writeFileSync(
      path.join(clientDir, "config.json"),
      JSON.stringify(defaultConfig, null, 2)
    )
    fs.writeFileSync(
      path.join(clientDir, "content.json"),
      JSON.stringify(defaultContent, null, 2)
    )
    return new StepResponse({ name: input.name })
  }
)

export const createClientWorkflow = createWorkflow(
  "create-client",
  (input: { name: string }) => {
    createClientStep(input)
  }
)
