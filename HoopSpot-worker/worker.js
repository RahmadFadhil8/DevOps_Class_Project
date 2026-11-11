const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hoopspot'
const CHECK_INTERVAL_MS = Number(process.env.CHECK_INTERVAL_MS) || 1000

// Model Booking yang sesuai dengan skema HoopSpot
const bookingSchema = new mongoose.Schema(
  {
    kode: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lapangan: { type: mongoose.Schema.Types.ObjectId, ref: 'Lapangan' },
    tanggal: { type: String, required: true },
    jamMulai: { type: String, required: true },
    durasi: { type: Number, required: true },
    nama: { type: String, required: true },
    email: { type: String, required: true },
    metode: { type: String, default: 'qris' },
    status: {
      type: String,
      enum: ['Menunggu Pembayaran', 'Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Menunggu Pembayaran',
    },
    batasPembayaran: { type: Date },
  },
  { timestamps: true, collection: 'bookings' }
)

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema)

// Model Lapangan minimal untuk populate judul
const lapanganSchema = new mongoose.Schema(
  {
    judul: String,
    alamat: String,
  },
  { collection: 'lapangan' }
)
mongoose.models.Lapangan || mongoose.model('Lapangan', lapanganSchema)

let isChecking = false
let lastHeartbeat = Date.now()

async function periksaBookingKadaluarsa() {
  if (isChecking) return
  isChecking = true

  try {
    const sekarang = new Date()

    // Cari booking berstatus 'Menunggu Pembayaran' yang sudah melewati batas waktu pembayaran
    const expiredBookings = await Booking.find({
      status: 'Menunggu Pembayaran',
      batasPembayaran: { $lte: sekarang },
    }).populate('lapangan', 'judul')

    if (expiredBookings.length > 0) {
      console.log(`[Worker] [${sekarang.toISOString()}] Menemukan ${expiredBookings.length} booking dengan waktu pembayaran habis.`)

      for (const booking of expiredBookings) {
        booking.status = 'Cancelled'
        await booking.save()

        const namaLapangan = booking.lapangan?.judul || 'Lapangan'
        console.log(
          `[Worker] [PEMBATALAN OTOMATIS] Booking ${booking.kode} (${namaLapangan}) berhasil dibatalkan otomatis.` +
          ` Slot ${booking.tanggal} jam ${booking.jamMulai} WIB kini TELAH DIBUKA KEMBALI.`
        )
      }
    }

    // Heartbeat berkala setiap 30 detik untuk kemudahan monitoring logs
    if (Date.now() - lastHeartbeat >= 30000) {
      console.log(`[Worker Heartbeat] [${sekarang.toLocaleTimeString('id-ID')}] Worker aktif memantau pembatalan booking otomatis.`)
      lastHeartbeat = Date.now()
    }
  } catch (error) {
    console.error('[Worker] Terjadi kesalahan saat memeriksa booking kadaluarsa:', error.message)
  } finally {
    isChecking = false
  }
}

async function hubungkanKeDatabase() {
  console.log('='.repeat(65))
  console.log(' HoopSpot Background Worker: Layanan Pembatalan Booking Otomatis')
  console.log('='.repeat(65))
  console.log(`[Worker] Menghubungkan ke MongoDB: ${MONGODB_URI}`)
  console.log(`[Worker] Interval pengecekan: ${CHECK_INTERVAL_MS} ms`)

  let tersambung = false
  while (!tersambung) {
    try {
      await mongoose.connect(MONGODB_URI)
      tersambung = true
      console.log('[Worker] Berhasil terhubung ke MongoDB!')
    } catch (err) {
      console.error(`[Worker] Koneksi MongoDB gagal (${err.message}). Mencoba ulang dalam 5 detik...`)
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }

  // Jalankan pengecekan pertama, lalu pasang interval berulang
  await periksaBookingKadaluarsa()
  const intervalId = setInterval(periksaBookingKadaluarsa, CHECK_INTERVAL_MS)

  const stopWorker = async (sinyal) => {
    console.log(`\n[Worker] Menerima sinyal ${sinyal}. Menutup koneksi worker...`)
    clearInterval(intervalId)
    await mongoose.disconnect()
    console.log('[Worker] Terputus dari MongoDB. Worker berhenti dengan aman.')
    process.exit(0)
  }

  process.on('SIGINT', () => stopWorker('SIGINT'))
  process.on('SIGTERM', () => stopWorker('SIGTERM'))
}

hubungkanKeDatabase()
