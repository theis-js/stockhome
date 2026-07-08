FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY shared/package.json shared/

RUN npm ci

COPY shared/ shared/
COPY backend/ backend/

RUN npm run build --workspace=shared
RUN npm run build --workspace=backend

FROM node:22-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY shared/package.json shared/

RUN npm ci --omit=dev

COPY --from=builder /app/backend/dist backend/dist
COPY --from=builder /app/backend/database.scheme.sql backend/
COPY --from=builder /app/shared/dist shared/dist

EXPOSE 8004
WORKDIR /app/backend
CMD ["node", "dist/server.js"]