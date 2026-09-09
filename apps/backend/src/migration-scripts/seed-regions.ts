import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
} from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createTaxRegionsWorkflow,
} from "@medusajs/medusa/core-flows"
import { loadClientConfig } from "../utils/client-config"

const countryByRegion: Record<string, string[]> = {
  EU: ["fr", "de", "es", "it", "be"],
  US: ["us"],
  UK: ["gb"],
  AFRICA: ["ci", "sn"],
}

export default async function seed_regions({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const config = loadClientConfig()
  const currencies = (config.currencies as string[]) ?? ["eur"]
  const defaultRegion = (config.defaultRegion as string) ?? "EU"
  const defaultCountry = (config.defaultCountry as string) ?? "FR"
  const countries = countryByRegion[defaultRegion] ?? [defaultCountry]

  for (const currency of currencies) {
    const name = `Region ${currency.toUpperCase()}`
    let region

    try {
      const { result } = await createRegionsWorkflow(container).run({
        input: {
          regions: [
            {
              name,
              currency_code: currency,
              countries,
              payment_providers: ["pp_system_default"],
            },
          ],
        },
      })
      region = result[0]
      logger.info(`Created region ${name}`)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      logger.warn(`Skipped region ${name}: ${message}`)
    }

    if (!region) {
      continue
    }

    try {
      await createTaxRegionsWorkflow(container).run({
        input: countries.map((country_code) => ({
          country_code,
          provider_id: "tp_system",
        })),
      })
      logger.info(`Seeded tax regions for ${name}`)
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e)
      logger.warn(`Skipped tax regions for ${name}: ${message}`)
    }
  }

  logger.info("Finished seeding extra regions")
}
