import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    await query.graph({ entity: "store", fields: ["id"] })
    res.status(200).json({ status: "ok", database: "ok" })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Health check failed"
    res.status(503).json({ status: "error", database: message })
  }
}
