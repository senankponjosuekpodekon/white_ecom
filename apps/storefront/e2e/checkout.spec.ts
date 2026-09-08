import { test, expect } from "@playwright/test";

test.describe("Checkout", () => {
  test.setTimeout(120000);

  test("completes a manual payment order", async ({ page }) => {
    await page.goto("/fr/products");
    const productLink = page.locator("li a").first();
    if ((await productLink.count()) === 0) {
      test.skip();
      return;
    }

    await productLink.click();
    await page.getByRole("button", { name: "Ajouter au panier" }).first().click();
    await page.waitForTimeout(2000);
    await page.goto("/fr/checkout");

    await expect(page.locator("h1")).toContainText("Paiement", { timeout: 30000 });
    await page.getByRole("button", { name: "Payer manuellement (test)" }).click();

    await expect(page).toHaveURL(/\/fr\/checkout\/result\?order_id=/);
    await expect(page.locator("main").nth(1)).toContainText("Commande");
  });

  test("shows product prices in the configured currency", async ({ page }) => {
    await page.goto("/fr/products");
    const productLink = page.locator("li a").first();
    if ((await productLink.count()) === 0) {
      test.skip();
      return;
    }

    await productLink.click();
    await expect(page.locator("main").nth(1)).toContainText("€", { timeout: 15000 });
  });
});
