FROM node:20 AS builder

WORKDIR /app

COPY . .

ENV NODE_ENV=production
RUN npm run build -w @dtc/storefront

FROM node:20 AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/storefront/.next/standalone/ .
COPY --from=builder /app/apps/storefront/.next/static ./apps/storefront/.next/static
COPY --from=builder /app/apps/storefront/public ./apps/storefront/public

EXPOSE 3000

CMD ["node", "apps/storefront/server.js"]
