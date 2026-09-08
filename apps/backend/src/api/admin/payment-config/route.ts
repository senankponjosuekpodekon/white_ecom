import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { requireUser } from "../utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) {
    return
  }

  const stripeApiKey = process.env.STRIPE_API_KEY ?? ""
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? ""

  res.json({
    stripe: {
      configured: Boolean(stripeApiKey && !stripeApiKey.includes("placeholder")),
      webhookConfigured: Boolean(
        stripeWebhookSecret && !stripeWebhookSecret.includes("placeholder")
      ),
      hasPlaceholder: stripeApiKey.includes("placeholder"),
    },
    providers: [
      { id: "pp_stripe_stripe", label: "Stripe" },
      { id: "pp_system_default", label: "Paiement manuel" },
    ],
  })
}
