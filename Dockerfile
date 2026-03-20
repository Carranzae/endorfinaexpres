# Build stage
FROM node:20-slim AS builder

WORKDIR /usr/src/app

# 1. Copiar TODOS los archivos de configuración primero
COPY backend-erp/package*.json ./
COPY backend-erp/tsconfig*.json ./
COPY backend-erp/nest-cli.json ./
COPY backend-erp/prisma ./prisma/
COPY backend-erp/prisma.config.ts ./

# 2. Instalar dependencias del sistema (openssl para Prisma)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 3. Instalar TODAS las dependencias de Node (dev + prod)
RUN npm install

# 4. Generar Prisma Client
RUN npx prisma generate

# 5. Copiar todo el código fuente del backend
COPY backend-erp/ .

# 6. Compilar NestJS y VERIFICAR que dist/main.js existe
RUN npm run build
RUN echo "=== Build output ===" && ls -la dist/ && \
    test -f dist/main.js && echo "✅ dist/main.js found!" || \
    (echo "❌ dist/main.js NOT FOUND! Build failed." && exit 1)

# ---

# Production stage
FROM node:20-slim AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copiar output del build y archivos necesarios
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./

# Instalar openssl (Prisma) y tsx (seed)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npm install -g tsx

EXPOSE 3000

CMD npx prisma migrate deploy && npx prisma db seed && node dist/main.js
