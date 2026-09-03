import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/framework/utils"

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("Store feeds", () => {
      beforeEach(async () => {
        const productService = getContainer().resolve(Modules.PRODUCT)

        await productService.createProducts({
          products: [
            {
              title: "Test T-Shirt",
              handle: "test-t-shirt",
              description: "A test t-shirt.",
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
                  options: [
                    {
                      title: "Size",
                      value: "S",
                    },
                    {
                      title: "Color",
                      value: "Black",
                    },
                  ],
                },
              ],
            },
          ],
        } as any)
      })

      describe("GET /store/feed/google", () => {
        it("returns a CSV with product data", async () => {
          const response = await api.get("/store/feed/google")

          expect(response.status).toEqual(200)
          expect(response.headers["content-type"]).toContain("text/csv")
          expect(response.data).toContain("Test T-Shirt")
          expect(response.data).toContain("TEST-S-BLACK")
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
    })
  },
})

jest.setTimeout(60 * 1000)
