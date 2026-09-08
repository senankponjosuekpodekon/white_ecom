FROM node:20 AS builder

WORKDIR /app

# Copy package manifests first so npm ci is cached until dependencies change
COPY package.json package-lock.json .npmrc ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/

ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 4 \
    && npm config set fetch-timeout 600000 \
    && npm ci

# Then copy the rest of the source; source-only changes reuse the cached layer above
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
