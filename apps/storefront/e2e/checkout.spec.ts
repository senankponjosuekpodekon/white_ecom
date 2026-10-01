import { test, expect } from "@playwright/test";

test.describe("Checkout", () => {
  test.setTimeout(120000);

  test("completes a manual payment order", async ({ page }) => {
    await page.goto("/fr/products");
    const productLink = page.locator('[data-testid="product-link"]').first();
    if ((await productLink.count()) === 0) {
      test.skip();
      return;
    }

    await productLink.click();
    await page.getByRole("button", { name: "Ajouter au panier" }).first().click();
    await page.waitForTimeout(2000);
    await page.goto("/fr/checkout");

    // Step 1: contact + address
    await expect(page.getByLabel(/Email/i)).toBeVisible({ timeout: 30000 });
    await page.getByLabel(/Email/i).fill("customer@example.com");
    await page.getByLabel(/Prénom/i).fill("Jean");
    await page.getByLabel(/^Nom/i).fill("Dupont");
    await page.getByLabel(/Adresse/i).fill("1 rue de la Paix");
    await page.getByLabel(/Code postal/i).fill("75001");
    await page.getByLabel(/Ville/i).fill("Paris");
    await page.getByRole("button", { name: "Continuer" }).click();

    // Step 2: shipping (may be skipped for digital catalogs)
    const continueBtn = page.getByRole("button", { name: "Continuer" });
    const manualPayBtn = page.getByRole("button", {
      name: /Payer à la livraison|virement/i,
    });
    await Promise.race([
      continueBtn.waitFor({ state: "visible", timeout: 15000 }),
      manualPayBtn.waitFor({ state: "visible", timeout: 15000 }),
    ]);

    if (await continueBtn.isVisible()) {
      const radio = page.locator('input[name="optionId"]').first();
      if ((await radio.count()) > 0) {
        await radio.check();
      }
      await continueBtn.click();
    }

    // Step 3: payment
    await expect(
      page.getByRole("button", { name: /Payer à la livraison|virement/i })
    ).toBeVisible({ timeout: 30000 });
    await page
      .getByRole("button", { name: /Payer à la livraison|virement/i })
      .click();

    await expect(page).toHaveURL(/\/fr\/checkout\/result\?order_id=/);
    await expect(page.locator("main").nth(1)).toContainText("Commande");
  });

  test("shows product prices in the configured currency", async ({ page }) => {
    await page.goto("/fr/products");
    const productLink = page.locator('[data-testid="product-link"]').first();
    if ((await productLink.count()) === 0) {
      test.skip();
      return;
    }

    await productLink.click();
    await expect(page.locator("main").nth(1)).toContainText("€", {
      timeout: 15000,
    });
  });
});
