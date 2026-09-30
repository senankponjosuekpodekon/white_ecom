import { defineMiddlewares, authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/*",
      middlewares: [authenticate("user", ["session", "bearer"])],
    },
  ],
})
