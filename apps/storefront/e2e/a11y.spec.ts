import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = ["/fr", "/fr/products", "/fr/login", "/fr/wishlist"];

test.describe("Accessibility", () => {
  for (const path of pages) {
    test(`a11y scan ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(
        results.violations,
        JSON.stringify(
          results.violations.map((v) => ({ id: v.id, nodes: v.nodes.length })),
          null,
          2
        )
      ).toEqual([]);
    });
  }
});
