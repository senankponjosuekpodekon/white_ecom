import { defineMiddlewares, authenticate } from "@medusajs/framework/http"
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createIpRateLimiter } from "../utils/rate-limit"

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
      matcher: "/store/carts*",
      middlewares: [
        createIpRateLimiter({ windowMs: 60_000, max: 60, prefix: "carts" }),
      ],
    },
  ],
})
