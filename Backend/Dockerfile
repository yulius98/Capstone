FROM node:22.23.0-alpine3.24
RUN apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src/ src/
COPY prisma/ prisma/
COPY prisma.config.ts .

# Dummy DATABASE_URL hanya untuk keperluan build (prisma generate).
# Nilai asli di-set lewat environment di docker-compose.yml saat container berjalan.
ENV DATABASE_URL="postgresql://postgres:Laravel12@postgres:5432/bank_sampah?schema=public"

RUN npx prisma generate && mkdir -p src/uploads && chown -R node:node src/uploads
USER node
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && node src/server.js"]
