import { loadEnv, defineConfig } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const redisUrl = process.env.REDIS_URL
const redisOptions = redisUrl && (
  redisUrl.startsWith("rediss://") || redisUrl.includes("upstash.io")
) ? { tls: {} } : undefined

const modules: Record<string, any>[] = [
  {
    resolve: "@medusajs/medusa/payment",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/payment-stripe",
          id: "stripe",
          options: {
            apiKey: process.env.STRIPE_API_KEY,
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            automatic_payment_methods: true,
          },
        },
      ],
    },
  },
]

if (redisUrl) {
  modules.push({
    resolve: "@medusajs/medusa/event-bus-redis",
    options: {
      redisUrl,
      redisOptions,
    },
  })
  modules.push({
    resolve: "@medusajs/medusa/workflow-engine-redis",
    options: {
      redis: {
        redisUrl,
        redisOptions,
      },
    },
  })
  modules.push({
    resolve: "@medusajs/medusa/locking",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/locking-redis",
          id: "locking-redis",
          is_default: true,
          options: {
            redisUrl,
            redisOptions,
          },
        },
      ],
    },
  })
  if (process.env.MEDUSA_FF_CACHING === "true") {
    modules.push({
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            resolve: "@medusajs/caching-redis",
            id: "caching-redis",
            is_default: true,
            options: {
              redisUrl,
              redisOptions,
            },
          },
        ],
      },
    })
  }
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl,
    redisOptions,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
    sessionOptions: {
      name: process.env.SESSION_COOKIE_NAME || "connect.sid",
      resave: false,
      saveUninitialized: false,
      rolling: true,
    },
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true",
      sameSite: (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") || "lax",
      httpOnly: process.env.COOKIE_HTTP_ONLY !== "false",
      maxAge: Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
    },
  },
  modules,
});
