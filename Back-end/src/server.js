import mongoose from 'mongoose'
import app from './app.js'
import { env } from './config/env.js'
import { releaseExpiredHolds } from './services/booking.service.js'

async function start() {
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 })
  } catch (err) {
    console.error('\n✖ Gagal terhubung ke MongoDB:', err.message)
    console.error('  Pastikan MongoDB berjalan dan MONGODB_URI di file .env benar.')
    console.error('  Tips: pakai 127.0.0.1 (bukan localhost) agar tidak kena masalah IPv6 di Node 18+.\n')
    process.exit(1)
  }
  console.log(`✔ MongoDB terhubung (database: ${mongoose.connection.name})`)

  // Pastikan semua index (termasuk unique index anti double-booking) sudah siap sebelum menerima request
  await Promise.all(Object.values(mongoose.models).map((m) => m.init()))

  const server = app.listen(env.port, () => {
    console.log(`✔ API berjalan di http://localhost:${env.port}/api`)
  })

  // Sapu booking Pending yang tidak dibayar tiap menit supaya slotnya kembali kosong
  const sweeper = setInterval(() => {
    releaseExpiredHolds().catch((e) => console.error('Gagal membersihkan hold:', e.message))
  }, 60_000)
  sweeper.unref()

  const shutdown = async () => {
    console.log('\nMenutup server...')
    clearInterval(sweeper)
    server.close(async () => {
      await mongoose.disconnect()
      process.exit(0)
    })
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

start()
