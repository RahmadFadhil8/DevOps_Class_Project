# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Konfigurasi proxy ke backend container
ARG BACKEND_URL=http://backend:4000
ENV BACKEND_URL=${BACKEND_URL}

# Salin file dependencies
COPY package*.json ./

# Install dependensi
RUN npm install

# Salin source code
COPY . .

# Build aplikasi Nuxt
RUN npm run build

# Stage 2: Runtime image yang ringan
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Salin hasil build saja
COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
