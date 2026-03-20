# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copiar archivos de configuración
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar TODAS las dependencias (incluidas devDependencies)
RUN npm install

# Generar Prisma Client
RUN npx prisma generate

# Copiar el código fuente
COPY . .

# Compilar proyecto NestJS Y verificar que el output existe
RUN npm run build && \
    ls -la dist/ && \
    test -f dist/main.js || (echo "❌ BUILD FAILED: dist/main.js not found!" && exit 1)

# ---

# Production stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copiar output del build y archivos necesarios
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/prisma.config.ts ./

# Instalar tsx globalmente para el seed
RUN npm install -g tsx

EXPOSE 3000

CMD npx prisma migrate deploy && npx prisma db seed && node dist/main.js
