FROM node:20-slim

WORKDIR /app

# Salin file package
COPY package*.json ./

# Install dependensi
RUN npm install --omit=dev

# Salin seluruh kode backend
COPY . .

# Port backend Express
EXPOSE 4000

# Jika AUTO_SEED bernilai true, database akan di-seed otomatis sebelum server mulai
CMD ["sh", "-c", "if [ \"$AUTO_SEED\" = \"true\" ]; then node seed.js; fi && node server.js"]
