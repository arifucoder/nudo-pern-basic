# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Dependency layer (cached unless package.json changes)
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

# Generate Prisma client (needed before build/runtime)
RUN npx prisma generate

# Copy rest of the source and build with tsup
COPY . .
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 5000
CMD ["node", "dist/server.js"]