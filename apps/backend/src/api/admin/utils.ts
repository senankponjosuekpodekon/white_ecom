import path from "path"
import { MedusaRequest, MedusaResponse, AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { CLIENT_MODULE } from "../../modules/client"
import type ClientModuleService from "../../modules/client/service"
import type { ClientRecord } from "../../utils/client-resolver"

const clientsDir = path.resolve(process.cwd(), "clients")

function getAuthContext(req: MedusaRequest) {
  return (req as unknown as AuthenticatedMedusaRequest).auth_context
}

function getUserEmail(req: MedusaRequest): string | undefined {
  const ctx = getAuthContext(req)
  const metadata = ctx?.user_metadata ?? ctx?.app_metadata
  const raw = metadata?.email
  return typeof raw === "string" ? raw.toLowerCase().trim() : undefined
}

export function requireUser(req: MedusaRequest, res: MedusaResponse): boolean {
  const ctx = getAuthContext(req)
  if (!ctx || ctx.actor_type !== "user" || !ctx.actor_id) {
    res.status(401).json({ error: "Unauthorized" })
    return false
  }
  return true
}

export function requireSuperAdmin(req: MedusaRequest, res: MedusaResponse): boolean {
  if (!requireUser(req, res)) {
    return false
  }
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL?.toLowerCase().trim()
  if (!superAdminEmail) {
    res.status(403).json({ error: "Forbidden: super-admin email not configured" })
    return false
  }
  const email = getUserEmail(req)
  if (!email || email !== superAdminEmail) {
    res.status(403).json({ error: "Forbidden: super-admin only" })
    return false
  }
  return true
}

// Returns the tenant (client record) this admin request operates on: the
// merchant's own tenant, or the one a super-admin selected via
// x-admin-client. Undefined means "platform scope" (no tenant context).
export async function tenantClient(
  req: MedusaRequest
): Promise<ClientRecord | undefined> {
  const clientId = (
    req as MedusaRequest & { tenant_context?: { clientId?: string } }
  ).tenant_context?.clientId
  if (!clientId) {
    return undefined
  }
  try {
    const service = req.scope.resolve<ClientModuleService>(CLIENT_MODULE)
    const clients = (await service.listClients(
      { id: clientId },
      {}
    )) as unknown as ClientRecord[]
    return clients[0]
  } catch {
    return undefined
  }
}

export function isValidClientName(name: string): boolean {
  return /^[a-z0-9-]+$/.test(name)
}

export function safeClientPath(...parts: string[]): string | undefined {
  const clientName = process.env.CLIENT_NAME
  if (!clientName) {
    return undefined
  }
  const clientRoot = path.resolve(clientsDir, clientName)
  const target = path.resolve(clientRoot, ...parts)
  if (target !== clientRoot && !target.startsWith(clientRoot + path.sep)) {
    return undefined
  }
  return target
}
