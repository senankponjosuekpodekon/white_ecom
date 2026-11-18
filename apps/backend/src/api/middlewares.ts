import { defineMiddlewares, authenticate } from "@medusajs/framework/http"
import type {
  MedusaNextFunction,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
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

// --- Merchant scoping -------------------------------------------------------
// A "merchant" is an admin user bound to a tenant via user metadata
// client_id. Every /admin/* request of such a user is scoped to the tenant's
// sales channel: list reads get a forced sales_channel_id filter and detail
// reads/writes are checked against the tenant's channel.

type TenantContext = { clientId: string; salesChannelId: string | null }

declare module "@medusajs/framework/http" {
  interface MedusaRequest {
    tenant_context?: TenantContext
  }
}

function requestEmail(req: MedusaRequest): string | undefined {
  const ctx = (req as unknown as {
    auth_context?: { app_metadata?: { email?: string }; user_metadata?: { email?: string } }
  }).auth_context
  const raw = ctx?.user_metadata?.email ?? ctx?.app_metadata?.email
  return typeof raw === "string" ? raw.toLowerCase().trim() : undefined
}

async function resolveTenantContext(
  req: MedusaRequest
): Promise<TenantContext | null> {
  if (req.tenant_context) {
    return req.tenant_context
  }
  const authContext = (
    req as unknown as { auth_context?: { actor_id?: string; actor_type?: string } }
  ).auth_context
  if (authContext?.actor_type !== "user" || !authContext.actor_id) {
    return null
  }
  try {
    const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)

    // God-mode: a super-admin sends x-admin-client: <id|slug> to operate
    // inside a tenant's scope (same filters as a merchant of that tenant).
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.toLowerCase().trim()
    const requested = req.headers["x-admin-client"]
    const target = Array.isArray(requested) ? requested[0] : requested
    if (target && superAdminEmail && requestEmail(req) === superAdminEmail) {
      const clients = (await service.listClients(
        { id: target },
        {}
      )) as unknown as ClientRecord[]
      const client =
        clients[0] ??
        ((
          await service.listClients({ slug: target }, {})
        ) as unknown as ClientRecord[])[0]
      if (client) {
        req.tenant_context = {
          clientId: client.id,
          salesChannelId: client.sales_channel_id ?? null,
        }
        return req.tenant_context
      }
    }

    const userModule = req.scope.resolve(Modules.USER) as {
      retrieveUser: (id: string) => Promise<{
        id: string
        metadata?: { client_id?: string } | null
      }>
    }
    const user = await userModule.retrieveUser(authContext.actor_id)
    const clientId = user?.metadata?.client_id
    if (!clientId) {
      return null
    }
    const clients = (await service.listClients(
      { id: clientId },
      {}
    )) as unknown as ClientRecord[]
    const client = clients[0]
    if (!client) {
      return null
    }
    req.tenant_context = {
      clientId: client.id,
      salesChannelId: client.sales_channel_id ?? null,
    }
    return req.tenant_context
  } catch {
    return null
  }
}

async function tenantContext(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  await resolveTenantContext(req)
  next()
}

// "/admin/products/prod_1/variants" -> "prod_1", null when the path is the
// collection itself.
function resourceId(req: MedusaRequest, prefix: string): string | null {
  const rest = req.path.slice(prefix.length).split("/").filter(Boolean)
  return rest[0] ?? null
}

async function scopeProducts(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const tenant = await resolveTenantContext(req)
  if (!tenant || !tenant.salesChannelId) {
    next()
    return
  }

  const id = resourceId(req, "/admin/products")
  if (!id) {
    // Collection endpoints: force the channel filter on reads; a product a
    // merchant creates goes straight into their channel.
    if (req.method === "GET") {
      req.query.sales_channel_id = tenant.salesChannelId
    } else if (req.method === "POST") {
      const body = req.body as { sales_channels?: { id: string }[] }
      if (!body?.sales_channels?.length) {
        body.sales_channels = [{ id: tenant.salesChannelId }]
      }
    }
    next()
    return
  }

  // Detail endpoints: the product must be linked to the tenant's channel.
  try {
    const productModule = req.scope.resolve(Modules.PRODUCT) as {
      listProducts: (
        filters: Record<string, unknown>,
        config?: { select?: string[] }
      ) => Promise<{ id: string }[]>
    }
    const rows = await productModule.listProducts(
      { id, sales_channels: { id: tenant.salesChannelId } },
      { select: ["id"] }
    )
    if (!rows.length) {
      res.status(403).json({ message: "Product outside your sales channel" })
      return
    }
  } catch {
    res.status(500).json({ message: "Tenant scoping failed" })
    return
  }
  next()
}

async function scopeOrders(
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const tenant = await resolveTenantContext(req)
  if (!tenant || !tenant.salesChannelId) {
    next()
    return
  }

  const id = resourceId(req, "/admin/orders")
  if (!id) {
    if (req.method === "GET") {
      req.query.sales_channel_id = tenant.salesChannelId
    }
    next()
    return
  }

  try {
    const orderModule = req.scope.resolve(Modules.ORDER) as {
      retrieveOrder: (id: string) => Promise<{ sales_channel_id?: string | null }>
    }
    const order = await orderModule.retrieveOrder(id)
    if (order.sales_channel_id !== tenant.salesChannelId) {
      res.status(403).json({ message: "Order outside your sales channel" })
      return
    }
  } catch {
    res.status(404).json({ message: "Order not found" })
    return
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
      middlewares: [authenticate("user", ["session", "bearer"]), tenantContext],
    },
    {
      matcher: "/admin/products*",
      middlewares: [scopeProducts],
    },
    {
      matcher: "/admin/orders*",
      middlewares: [scopeOrders],
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
