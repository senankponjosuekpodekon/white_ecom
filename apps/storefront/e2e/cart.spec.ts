import { test, expect } from "@playwright/test";

test.describe("Cart and checkout", () => {
  test("adds a product to the cart and opens checkout", async ({ page }) => {
    await page.goto("/fr/products");
    const productLink = page.locator("li a").first();
    const count = await productLink.count();
    test.skip(count === 0, "No products available for this test");

    await productLink.click();
    await page.getByRole("button", { name: "Ajouter au panier" }).click();
    await page.getByRole("link", { name: "Panier" }).click();

    await expect(page.locator("h1")).toContainText("Panier");

    await page.goto("/fr/checkout");
    await expect(page.locator("h1")).toContainText("Paiement");
  });
});
