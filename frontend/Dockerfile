FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY shared/package.json shared/

RUN npm ci

COPY shared/ shared/
COPY frontend/ frontend/

# Build shared first, then frontend
RUN npm run build --workspace=shared
RUN npm run build --workspace=frontend

FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/frontend/dist .

COPY frontend/nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]