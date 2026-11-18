import { defineMiddlewares, authenticate } from "@medusajs/framework/http"
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createIpRateLimiter } from "../utils/rate-limit"
import { CLIENT_MODULE } from "../modules/client"
import type ClientModuleService from "../modules/client/service"
import type { ClientRecord } from "../utils/client-resolver"

// Reject store calls whose publishable key belongs to a tenant that is no
// longer active (suspended/rejected/failed). Keys not owned by a tenant
// (e.g. the platform key) are unaffected.
const BLOCKED_CLIENT_STATUSES = new Set(["suspended", "rejected", "failed"])
async function activeTenantGuard(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const header = req.headers["x-publishable-api-key"]
  const key = Array.isArray(header) ? header[0] : header
  if (!key) {
    next()
    return
  }
  try {
    const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)
    const clients = (await service.listClients(
      { publishable_key: key },
      {}
    )) as unknown as ClientRecord[]
    const client = clients[0]
    if (client && BLOCKED_CLIENT_STATUSES.has(client.status)) {
      res.status(403).json({ message: "This store is not available" })
      return
    }
  } catch {
    // Client module unavailable: do not block the store.
  }
  next()
}

// Structured error log for every 5xx — readable via docker logs / Render logs.
// Function matcher so it applies to all routes (store, admin, auth, feeds).
function errorLogger(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const start = Date.now()
  res.on("finish", () => {
    if (res.statusCode >= 500) {
      console.error(
        JSON.stringify({
          level: "error",
          type: "http.5xx",
          method: req.method,
          path: req.originalUrl ?? req.url,
          status: res.statusCode,
          durationMs: Date.now() - start,
        })
      )
    }
  })
  next()
}

export default defineMiddlewares({
  routes: [
    {
      matcher: /.*/,
      middlewares: [errorLogger],
    },
    {
      matcher: "/admin/*",
      middlewares: [authenticate("user", ["session", "bearer"])],
    },
    {
      matcher: "/auth/*",
      middlewares: [
        createIpRateLimiter({ windowMs: 60_000, max: 10, prefix: "auth" }),
      ],
    },
    {
      matcher: "/store/*",
      middlewares: [activeTenantGuard],
    },
    {
      matcher: "/store/carts*",
      middlewares: [
        createIpRateLimiter({ windowMs: 60_000, max: 60, prefix: "carts" }),
      ],
    },
    {
      matcher: "/store/onboarding",
      middlewares: [
        createIpRateLimiter({ windowMs: 3_600_000, max: 5, prefix: "onboarding" }),
      ],
    },
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
