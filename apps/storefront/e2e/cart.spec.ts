import { test, expect } from "@playwright/test";

test.describe("Cart and checkout", () => {
  test.setTimeout(90000);

  test("adds a product to the cart and opens checkout", async ({ page }) => {
    await page.goto("/fr/products");
    const productLink = page.locator('[data-testid="product-link"]').first();
    const count = await productLink.count();
    test.skip(count === 0, "No products available for this test");

    await productLink.click();
    await page.getByRole("button", { name: "Ajouter au panier" }).first().click();
    // Wait for the server action to set the cart cookie (slow on cold backends).
    await expect
      .poll(
        async () =>
          (await page.context().cookies()).some((c) => c.name === "cartId"),
        { timeout: 30000 }
      )
      .toBe(true);
    await page.goto("/fr/cart");

    await expect(page.locator("h1")).toContainText("Votre panier", { timeout: 15000 });
    await expect(page.locator("main").nth(1)).toContainText("Quantité", { timeout: 15000 });

    await page.goto("/fr/checkout");
    await expect(page.locator("h1")).toContainText("Commande", { timeout: 30000 });
  });
});
