import {
  escapeCsv,
  formatPrice,
  getAvailability,
  getCondition,
  getIdentifier,
  getGoogleProductCategory,
  getMetadataValue,
  type Product,
} from "../../../../../utils/feed"

const baseProduct = {
  id: "prod_123",
  title: "T-Shirt",
  handle: "t-shirt",
  description: "A nice t-shirt",
  thumbnail: "https://example.com/t-shirt.jpg",
  metadata: {},
  variants: [],
  images: [],
  categories: [],
} as Product

const baseVariant = {
  id: "variant_123",
  title: "S / Black",
  sku: "TSHIRT-S-BLACK",
  prices: [{ amount: 1000, currency_code: "eur" }],
  inventory_quantity: 10,
  manage_inventory: true,
  allow_backorder: false,
  metadata: {},
}

describe("feed helpers", () => {
  describe("escapeCsv", () => {
    it("returns simple values unchanged", () => {
      expect(escapeCsv("hello")).toBe("hello")
    })

    it("wraps values with commas in quotes", () => {
      expect(escapeCsv("hello, world")).toBe('"hello, world"')
    })

    it("escapes double quotes", () => {
      expect(escapeCsv('hello "world"')).toBe('"hello ""world"""')
    })
  })

  describe("formatPrice", () => {
    it("converts cents to major units", () => {
      expect(formatPrice(1000)).toBe("10.00")
    })
  })

  describe("getAvailability", () => {
    it("returns preorder when allow_backorder is true", () => {
      const variant = { ...baseVariant, allow_backorder: true }
      expect(getAvailability(variant)).toBe("preorder")
    })

    it("returns in stock when manage_inventory is false", () => {
      const variant = { ...baseVariant, manage_inventory: false }
      expect(getAvailability(variant)).toBe("in stock")
    })

    it("returns out of stock when inventory is 0", () => {
      const variant = { ...baseVariant, inventory_quantity: 0 }
      expect(getAvailability(variant)).toBe("out of stock")
    })
  })

  describe("getCondition", () => {
    it("defaults to new", () => {
      expect(getCondition(baseProduct, baseVariant)).toBe("new")
    })

    it("respects metadata condition", () => {
      const product = { ...baseProduct, metadata: { condition: "used" } }
      expect(getCondition(product, baseVariant)).toBe("used")
    })

    it("ignores invalid condition values", () => {
      const product = { ...baseProduct, metadata: { condition: "broken" } }
      expect(getCondition(product, baseVariant)).toBe("new")
    })
  })

  describe("getIdentifier", () => {
    it("uses mpn from variant metadata when available", () => {
      const variant = { ...baseVariant, metadata: { mpn: "META-MPN" } }
      const result = getIdentifier(baseProduct, variant)
      expect(result.mpn).toBe("META-MPN")
      expect(result.exists).toBe("yes")
    })

    it("falls back to variant sku for mpn", () => {
      const result = getIdentifier(baseProduct, baseVariant)
      expect(result.mpn).toBe("TSHIRT-S-BLACK")
    })
  })

  describe("getGoogleProductCategory", () => {
    it("uses metadata google_product_category first", () => {
      const product = { ...baseProduct, metadata: { google_product_category: "Cat > A" } }
      expect(getGoogleProductCategory(product, "")).toBe("Cat > A")
    })

    it("falls back to default category", () => {
      expect(getGoogleProductCategory(baseProduct, "Default > Category")).toBe("Default > Category")
    })
  })

  describe("getMetadataValue", () => {
    it("prefers variant metadata over product metadata", () => {
      const product = { ...baseProduct, metadata: { color: "red" } }
      const variant = { ...baseVariant, metadata: { color: "black" } }
      expect(getMetadataValue(product, variant, ["color"])).toBe("black")
    })

    it("falls back to product metadata", () => {
      const product = { ...baseProduct, metadata: { color: "red" } }
      expect(getMetadataValue(product, baseVariant, ["color"])).toBe("red")
    })
  })
})
