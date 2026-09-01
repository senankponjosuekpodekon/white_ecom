FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

ENV NPM_CONFIG_FETCH_TIMEOUT=1200000
ENV NPM_CONFIG_FETCH_RETRIES=5
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/

RUN npm ci

ENV NODE_ENV=production
RUN npm run build -w @dtc/storefront

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/storefront/.next/standalone ./
COPY --from=builder /app/apps/storefront/.next/static ./.next/static
COPY --from=builder /app/apps/storefront/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
