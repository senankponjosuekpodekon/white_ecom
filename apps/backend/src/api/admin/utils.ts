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
