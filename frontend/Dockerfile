FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .

COPY docker-entrypoint.d/10-runtime-env.sh /docker-entrypoint.d/10-runtime-env.sh
RUN chmod +x /docker-entrypoint.d/10-runtime-env.sh

COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]