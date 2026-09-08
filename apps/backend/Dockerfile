FROM node:20-alpine

WORKDIR /app

# Copy package manifests first so npm ci is cached until dependencies change
COPY package.json package-lock.json .npmrc ./
COPY apps/backend/package.json ./apps/backend/
COPY apps/storefront/package.json ./apps/storefront/

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 4 \
    && npm config set fetch-timeout 600000 \
    && npm ci

# Then copy the rest of the source; source-only changes reuse the cached layer above
COPY . .

ENV NODE_ENV=production

WORKDIR /app/apps/backend
RUN npm run build

# Medusa start uses process.cwd() as rootDirectory for the admin build
# so we copy the built admin UI to the root public/ folder.
RUN mkdir -p public && cp -r .medusa/server/public/admin public/admin

RUN chmod +x entrypoint.sh

EXPOSE 9000

CMD ["./entrypoint.sh"]
