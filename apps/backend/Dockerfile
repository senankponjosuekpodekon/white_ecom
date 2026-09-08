FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm ci
ENV NODE_ENV=production
RUN npm run build -w @dtc/backend

# Medusa start uses process.cwd() as rootDirectory for the admin build
# so we copy the built admin UI to the root public/ folder.
RUN mkdir -p public && cp -r .medusa/server/public/admin public/admin

RUN chmod +x entrypoint.sh

EXPOSE 9000

CMD ["./entrypoint.sh"]
