# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite bakes VITE_* vars into the build at build time
ARG VITE_API_BASE=http://localhost:5000/api
ENV VITE_API_BASE=$VITE_API_BASE

RUN npm run build

# ---------- Stage 2: Serve with nginx ----------
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
