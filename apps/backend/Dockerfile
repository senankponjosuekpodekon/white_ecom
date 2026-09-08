FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 4 \
    && npm config set fetch-timeout 600000 \
    && npm ci
ENV NODE_ENV=production

WORKDIR /app/apps/backend
RUN npm run build

# Medusa start uses process.cwd() as rootDirectory for the admin build
# so we copy the built admin UI to the root public/ folder.
RUN mkdir -p public && cp -r .medusa/server/public/admin public/admin

RUN chmod +x entrypoint.sh

EXPOSE 9000

CMD ["./entrypoint.sh"]
