import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("displays the store name and links to products", async ({ page }) => {
    await page.goto("/fr");
    await expect(page).toHaveTitle(/White Shop/);
    await expect(page.locator("h1")).toContainText("Votre boutique");
    await expect(page.getByRole("link", { name: "Découvrir le catalogue" })).toBeVisible();
  });

  test("can navigate to the products page", async ({ page }) => {
    await page.goto("/fr");
    await page.getByRole("link", { name: "Produits", exact: true }).click();
    await expect(page).toHaveURL(/\/fr\/products/);
    await expect(page.locator("h1")).toContainText("Nos produits");
  });
});
