import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const nodeEnv = process.env.NODE_ENV || 'development'

const mongoUri = process.env.MONGODB_URI
const jwtSecret = process.env.JWT_SECRET

if (!mongoUri) {
  throw new Error('MONGODB_URI belum diisi. Salin .env.example menjadi .env lalu isi nilainya.')
}
if (!jwtSecret || jwtSecret.length < 16) {
  throw new Error('JWT_SECRET belum diisi atau terlalu pendek (minimal 16 karakter).')
}
if (nodeEnv === 'production' && jwtSecret.startsWith('ganti-')) {
  throw new Error('JWT_SECRET masih berisi nilai contoh. Ganti dengan string acak sebelum production.')
}

export const env = {
  nodeEnv,
  isProd: nodeEnv === 'production',
  port: Number(process.env.PORT) || 4000,
  mongoUri,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  // Boleh lebih dari satu origin, pisahkan dengan koma
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
}
