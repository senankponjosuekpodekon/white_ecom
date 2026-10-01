import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { reindexAllProducts } from "../../../../utils/reindex-embeddings"
import { embeddingProvider } from "../../../../utils/embeddings"
import { requireUser } from "../../utils"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireUser(req, res)) return

  if (!embeddingProvider()) {
    res.status(503).json({
      error:
        "No embedding-capable AI provider configured (OPENAI_API_KEY, OLLAMA_BASE_URL, or CLOUDFLARE_*)",
    })
    return
  }

  try {
    const result = await reindexAllProducts(req.scope)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
