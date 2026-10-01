import { defineMiddlewares, authenticate } from "@medusajs/framework/http"
import { createIpRateLimiter } from "../utils/rate-limit"

export default defineMiddlewares({
  routes: [
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
