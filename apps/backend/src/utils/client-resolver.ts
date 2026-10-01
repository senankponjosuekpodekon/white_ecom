import type { MedusaRequest } from "@medusajs/framework/http"
import type { MedusaContainer } from "@medusajs/framework/types"
import { CLIENT_MODULE } from "../modules/client"
import type ClientModuleService from "../modules/client/service"

export type ClientRecord = {
  id: string
  slug: string
  name: string
  contact_email?: string | null
  status: string
  domains?: string[] | null
  config?: Record<string, unknown> | null
  content?: Record<string, unknown> | null
  publishable_key?: string | null
  publishable_key_id?: string | null
  sales_channel_id?: string | null
  storefront_url?: string | null
  error?: string | null
}

const IGNORED_STATUSES = new Set(["rejected", "failed"])

function requestPublishableKey(req: MedusaRequest): string | undefined {
  const header = req.headers["x-publishable-api-key"]
  const key = Array.isArray(header) ? header[0] : header
  return typeof key === "string" && key ? key : undefined
}

function requestHost(req: MedusaRequest): string | undefined {
  const host = req.headers["x-forwarded-host"] ?? req.headers.host
  const raw = Array.isArray(host) ? host[0] : host
  return raw?.split(",")[0]?.split(":")[0]?.trim().toLowerCase() || undefined
}

export async function resolveRequestClient(
  req: MedusaRequest,
  scope?: MedusaContainer
): Promise<ClientRecord | null> {
  const container = scope ?? req.scope
  let clients: ClientRecord[] = []
  try {
    const service = container.resolve<ClientModuleService>(CLIENT_MODULE)
    clients = (await service.listClients({}, {})) as unknown as ClientRecord[]
  } catch {
    return null
  }
  if (!clients.length) {
    return null
  }

  const key = requestPublishableKey(req)
  if (key) {
    const byKey = clients.find(
      (c) => c.publishable_key === key && !IGNORED_STATUSES.has(c.status)
    )
    if (byKey) {
      return byKey
    }
  }

  const host = requestHost(req)
  if (host) {
    const byDomain = clients.find(
      (c) =>
        !IGNORED_STATUSES.has(c.status) &&
        Array.isArray(c.domains) &&
        c.domains.some((d) => d.toLowerCase() === host)
    )
    if (byDomain) {
      return byDomain
    }
  }

  const clientSlug = process.env.CLIENT_NAME
  if (clientSlug) {
    const bySlug = clients.find(
      (c) => c.slug === clientSlug && !IGNORED_STATUSES.has(c.status)
    )
    if (bySlug) {
      return bySlug
    }
  }

  return null
}
