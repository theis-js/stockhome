FROM node:22-alpine AS builder

WORKDIR /app

# Workspace manifests (npm workspaces need these present)
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY shared/package.json shared/

# Install all deps for the monorepo (includes devDeps for building)
RUN npm ci

# Copy sources required to build shared + backend
COPY shared/ shared/
COPY backend/ backend/

# Build shared (now produces dist/esm + dist/cjs + dist/types) and then backend
RUN npm run build --workspace=shared
RUN npm run build --workspace=backend


FROM node:22-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Workspace manifests again (so npm can install prod deps for backend + shared)
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY shared/package.json shared/

# Install prod deps only
RUN npm ci --omit=dev

# Copy runtime artifacts
COPY --from=builder /app/backend/dist backend/dist
COPY --from=builder /app/backend/database.scheme.sql backend/database.scheme.sql

# Copy the full shared dist output (esm/cjs/types)
COPY --from=builder /app/shared/dist shared/dist
COPY shared/package.json shared/package.json

EXPOSE 8004
WORKDIR /app/backend
CMD ["node", "dist/server.js"]