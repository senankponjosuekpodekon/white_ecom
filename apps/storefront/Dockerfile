FROM node:20 AS builder

WORKDIR /app

COPY . .

ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
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
