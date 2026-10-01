import fs from "fs"
import path from "path"
import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createClientWorkflow } from "../../../workflows/create-client"
import { requireSuperAdmin, isValidClientName } from "../utils"

const clientsDir = path.resolve(process.cwd(), "clients")

const createSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine(isValidClientName, {
      message: "Client name must contain only lowercase letters, digits and dashes",
    }),
  domain: z
    .string()
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid domain")
    .optional(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  try {
    const current = process.env.CLIENT_NAME ?? "default"
    const dirs = fs
      .readdirSync(clientsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)

    res.json({ current, clients: dirs })
  } catch {
    res.json({ current: process.env.CLIENT_NAME ?? "default", clients: [] })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) {
    return
  }

  const parse = createSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }

  const { name, domain } = parse.data

  try {
    await createClientWorkflow(req.scope).run({ input: { name } })
    const provisionCommand = domain
      ? `./scripts/provision-client.sh ${name} ${domain}`
      : `./scripts/provision-client.sh ${name}`
    res.json({ success: true, name, provision: provisionCommand })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
