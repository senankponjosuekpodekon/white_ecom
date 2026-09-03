import { defaultContent, mergeContent } from "../default-content"

describe("mergeContent", () => {
  it("returns default content when no override is provided", () => {
    const result = mergeContent(defaultContent)
    expect(result.fr?.site?.description).toBe(defaultContent.fr?.site?.description)
    expect(result.en?.site?.description).toBe(defaultContent.en?.site?.description)
  })

  it("merges a partial override on top of default content", () => {
    const override = {
      fr: {
        site: {
          description: "Boutique personnalisée.",
        },
      },
    }
    const result = mergeContent(defaultContent, override)

    expect(result.fr?.site?.description).toBe("Boutique personnalisée.")
    expect(result.fr?.hero?.title).toBe(defaultContent.fr?.hero?.title)
    expect(result.en?.site?.description).toBe(defaultContent.en?.site?.description)
  })

  it("replaces arrays entirely rather than merging item by item", () => {
    const override = {
      fr: {
        features: [{ title: "Test", text: "Texte" }],
      },
    }
    const result = mergeContent(defaultContent, override)

    expect(result.fr?.features).toEqual([{ title: "Test", text: "Texte" }])
  })
})
