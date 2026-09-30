# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 4 \
    && npm config set fetch-timeout 600000 \
    && npm ci

COPY . .

ENV NODE_ENV=production

WORKDIR /app/apps/backend
RUN npm run build \
    && mkdir -p public \
    && cp -r .medusa/server/public/admin public/admin

FROM node:20-alpine AS runtime

RUN addgroup -S medusa && adduser -S medusa -G medusa

WORKDIR /app

COPY --from=builder --chown=medusa:medusa /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=medusa:medusa /app/node_modules ./node_modules
COPY --from=builder --chown=medusa:medusa /app/apps/backend ./apps/backend

RUN chmod +x apps/backend/entrypoint.sh

USER medusa

WORKDIR /app/apps/backend

EXPOSE 9000

CMD ["./entrypoint.sh"]
