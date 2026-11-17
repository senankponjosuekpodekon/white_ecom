import path from "path"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const clientsDir = path.resolve(process.cwd(), "clients")

type AuthContext = {
  actor_id?: string
  actor_type?: string
}

function getAuthContext(req: MedusaRequest): AuthContext | undefined {
  return (req as { auth_context?: AuthContext }).auth_context
}

export function requireUser(req: MedusaRequest, res: MedusaResponse): boolean {
  const auth = getAuthContext(req)
  if (!auth?.actor_id || auth.actor_type !== "user") {
    res.status(401).json({ error: "Unauthorized" })
    return false
  }
  return true
}

export async function requireSuperAdmin(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<boolean> {
  if (!requireUser(req, res)) {
    return false
  }

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
  if (!superAdminEmail) {
    res.status(500).json({ error: "SUPER_ADMIN_EMAIL not configured" })
    return false
  }

  const auth = getAuthContext(req)!
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as {
    graph: <T>(config: {
      entity: string
      fields: string[]
      filters?: Record<string, unknown>
    }) => Promise<{ data: T[] }>
  }
  const { data } = await query.graph<{ email?: string }>({
    entity: "user",
    fields: ["email"],
    filters: { id: auth.actor_id },
  })
  const email = data?.[0]?.email

  if (!email || email.toLowerCase() !== superAdminEmail.toLowerCase()) {
    res.status(403).json({ error: "Forbidden: super-admin only" })
    return false
  }
  return true
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
