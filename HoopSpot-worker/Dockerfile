FROM node:20-slim

WORKDIR /app

# Salin file package
COPY package*.json ./

# Install dependensi
RUN npm install --omit=dev

# Salin seluruh kode worker
COPY . .

# Jalankan worker
CMD ["node", "worker.js"]
