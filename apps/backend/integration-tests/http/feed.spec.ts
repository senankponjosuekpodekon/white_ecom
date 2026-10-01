import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/framework/utils"
import axios from "axios"

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("Store feeds", () => {
      beforeEach(async () => {
        const productService = getContainer().resolve(Modules.PRODUCT)
        const apiKeyService = getContainer().resolve(Modules.API_KEY)

        const [apiKey] = await apiKeyService.createApiKeys([
          {
            title: "Integration Test",
            type: "publishable",
            created_by: "test",
          },
        ])

        api.defaults.headers.common["x-publishable-api-key"] = apiKey.token

        await productService.createProducts([
          {
            title: "Test T-Shirt",
            handle: "test-t-shirt",
            description: "A test t-shirt.",
            status: "published",
            options: [
              { title: "Size", values: ["S"] },
              { title: "Color", values: ["Black"] },
            ],
            variants: [
              {
                title: "S / Black",
                sku: "TEST-S-BLACK",
                prices: [
                  {
                    amount: 1000,
                    currency_code: "eur",
                  },
                ],
                options: {
                  Size: "S",
                  Color: "Black",
                },
              },
            ],
          },
        ] as any)
      })

      describe("GET /store/feed/google", () => {
        it("returns a CSV with product data", async () => {
          const response = await api.get("/store/feed/google")

          expect(response.status).toEqual(200)
          expect(response.headers["content-type"]).toContain("text/csv")
          expect(response.data).toContain("id,title,description")
        })
      })

      describe("GET /store/feed/facebook", () => {
        it("returns a CSV", async () => {
          const response = await api.get("/store/feed/facebook")

          expect(response.status).toEqual(200)
          expect(response.headers["content-type"]).toContain("text/csv")
        })
      })

      describe("GET /store/feed/pinterest", () => {
        it("returns a CSV", async () => {
          const response = await api.get("/store/feed/pinterest")

          expect(response.status).toEqual(200)
          expect(response.headers["content-type"]).toContain("text/csv")
        })
      })

      describe("GET /store/feed/tiktok", () => {
        it("returns a CSV", async () => {
          const response = await api.get("/store/feed/tiktok")

          expect(response.status).toEqual(200)
          expect(response.headers["content-type"]).toContain("text/csv")
        })
      })

      describe("GET /feeds/* (public)", () => {
        it("serves feeds without a publishable key", async () => {
          const publicApi = axios.create({ baseURL: api.defaults.baseURL })
          delete publicApi.defaults.headers.common["x-publishable-api-key"]

          const response = await publicApi.get("/feeds/google")

          expect(response.status).toEqual(200)
          expect(response.headers["content-type"]).toContain("text/csv")
          expect(response.data).toContain("id,title,description")
        })
      })
    })
  },
})

jest.setTimeout(60 * 1000)
