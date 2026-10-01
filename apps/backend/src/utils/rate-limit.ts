import type { MedusaNextFunction, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import Redis from "ioredis"

let redis: Redis | null = null
const memoryHits = new Map<string, number[]>()

function getRedis(): Redis | null {
  const url = process.env.REDIS_URL
  if (!url) return null
  if (!redis) {
    redis = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1 })
    redis.connect().catch(() => undefined)
  }
  return redis
}

function clientIp(req: MedusaRequest): string {
  const forwarded = req.headers["x-forwarded-for"]
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return first?.split(",")[0]?.trim() || req.ip || "unknown"
}

export function createIpRateLimiter(options: {
  windowMs: number
  max: number
  prefix: string
}) {
  const { windowMs, max, prefix } = options

  return async function rateLimitMiddleware(
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
  ) {
    const key = `rl:${prefix}:${clientIp(req)}`
    const client = getRedis()

    if (client) {
      try {
        const count = await client.incr(key)
        if (count === 1) {
          await client.pexpire(key, windowMs)
        }
        if (count > max) {
          res.status(429).json({ error: "Too many requests" })
          return
        }
        return next()
      } catch {
        // Redis indisponible : fallback mémoire
      }
    }

    const now = Date.now()
    const hits = (memoryHits.get(key) ?? []).filter((t) => now - t < windowMs)
    hits.push(now)
    memoryHits.set(key, hits)
    if (hits.length > max) {
      res.status(429).json({ error: "Too many requests" })
      return
    }
    next()
  }
}
