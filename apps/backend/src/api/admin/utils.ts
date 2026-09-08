import path from "path"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const clientsDir = path.resolve(process.cwd(), "clients")

export function requireUser(req: MedusaRequest, res: MedusaResponse): boolean {
  const user = (req as { user?: unknown }).user
  if (!user) {
    res.status(401).json({ error: "Unauthorized" })
    return false
  }
  return true
}

export function requireSuperAdmin(req: MedusaRequest, res: MedusaResponse): boolean {
  if (!requireUser(req, res)) {
    return false
  }
  const user = (req as { user?: { email?: string } }).user
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL ?? "super@example.com"
  if (!user?.email || user.email !== superAdminEmail) {
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
