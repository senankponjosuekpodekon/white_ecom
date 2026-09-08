import { test, expect } from "@playwright/test";

test.describe("Customer auth", () => {
  test("registers, logs out and logs back in", async ({ page }) => {
    const email = `e2e-${Date.now()}@example.com`;
    const password = "password123";

    await page.goto("/fr/register");
    await page.locator('input[name="firstName"]').fill("E2E");
    await page.locator('input[name="lastName"]').fill("Test");
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole("button", { name: "Créer le compte" }).click();

    await expect(page).toHaveURL(/\/fr\/account/);
    await expect(page.locator("h1")).toContainText("Mon compte");

    await page.getByRole("button", { name: "Se déconnecter" }).click();
    await expect(page).toHaveURL(/\/fr\/login/);

    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();

    await expect(page).toHaveURL(/\/fr\/account/);
  });
});
