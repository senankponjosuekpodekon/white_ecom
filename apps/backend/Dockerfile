FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
RUN npm run build

RUN chmod +x entrypoint.sh

EXPOSE 9000

CMD ["./entrypoint.sh"]
