import { defineMiddlewares } from "@medusajs/framework/http"
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

// MANUAL_PAYMENT_ENABLED=false must block manual payment server-side too:
// a seeded region may still expose pp_system_default, and storefront env vars
// only hide the UI. Reject provider selection on the public store endpoint.
export default defineMiddlewares({
  routes: [
    {
      method: "POST",
      matcher: "/store/payment-collections/*/payment-sessions",
      middlewares: [
        (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
          const providerId = (req.body as { provider_id?: string })?.provider_id
          if (
            providerId === "pp_system_default" &&
            process.env.MANUAL_PAYMENT_ENABLED === "false"
          ) {
            res
              .status(403)
              .json({ message: "Manual payment is disabled for this store" })
            return
          }
          next()
        },
      ],
    },
  ],
})
