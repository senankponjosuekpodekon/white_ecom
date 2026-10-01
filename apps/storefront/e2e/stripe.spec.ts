import { test, expect } from "@playwright/test";

// Requires a deployment wired to Stripe test mode:
//   STRIPE_API_KEY=sk_test_*  NEXT_PUBLIC_STRIPE_KEY=pk_test_*
// Run with: STRIPE_E2E_ENABLED=true npx playwright test stripe.spec.ts
const enabled = process.env.STRIPE_E2E_ENABLED === "true";

test.describe("Checkout — Stripe test mode", () => {
  test.setTimeout(180000);
  test.skip(!enabled, "STRIPE_E2E_ENABLED not set — skipping live Stripe test");

  test("completes a card payment with Stripe test card", async ({ page }) => {
    await page.goto("/fr/products");
    const productLink = page.locator('[data-testid="product-link"]').first();
    if ((await productLink.count()) === 0) {
      test.skip(true, "No product available");
      return;
    }

    await productLink.click();
    await page.getByRole("button", { name: "Ajouter au panier" }).first().click();
    await page.waitForTimeout(2000);
    await page.goto("/fr/checkout");

    // Step 1: contact + address
    await expect(page.getByLabel(/Email/i)).toBeVisible({ timeout: 30000 });
    await page.getByLabel(/Email/i).fill("stripe-e2e@example.com");
    await page.getByLabel(/Prénom/i).fill("Test");
    await page.getByLabel(/^Nom/i).fill("Stripe");
    await page.getByLabel(/Adresse/i).fill("1 rue de la Paix");
    await page.getByLabel(/Code postal/i).fill("75001");
    await page.getByLabel(/Ville/i).fill("Paris");
    await page.getByRole("button", { name: "Continuer" }).click();

    // Step 2: shipping (skipped for digital catalogs)
    const continueBtn = page.getByRole("button", { name: "Continuer" });
    const stripeForm = page.locator('[class*="StripeElement"], iframe[title*="payment" i]').first();
    await Promise.race([
      continueBtn.waitFor({ state: "visible", timeout: 30000 }),
      stripeForm.waitFor({ state: "visible", timeout: 30000 }),
    ]);
    if (await continueBtn.isVisible().catch(() => false)) {
      const radio = page.locator('input[name="optionId"]').first();
      if ((await radio.count()) > 0) await radio.check();
      await continueBtn.click();
    }

    // Step 3: Stripe PaymentElement lives in an iframe.
    const paymentFrame = page.frameLocator(
      'iframe[title*="payment" i], iframe[name^="__privateStripeFrame"]'
    ).first();
    const cardInput = paymentFrame.locator('input[name="number"], [placeholder*="card" i], [aria-label*="card" i]').first();
    await cardInput.waitFor({ state: "visible", timeout: 60000 });
    await cardInput.fill("4242424242424242");
    await paymentFrame.locator('input[name="expiry"], [placeholder*="MM" i]').first().fill("1234");
    await paymentFrame.locator('input[name="cvc"], [placeholder*="CVC" i]').first().fill("424");

    await page.getByRole("button", { name: /Payer$/i }).click();

    // Successful test-mode payment redirects to the result page.
    await page.waitForURL(/checkout\/result|order_id=/, { timeout: 90000 });
    await expect(page.locator("body")).toBeVisible();
  });
});
