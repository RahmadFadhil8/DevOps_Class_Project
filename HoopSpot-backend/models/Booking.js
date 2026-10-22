const mongoose = require('mongoose')
const ubahJSON = require('./ubahJSON')

const bookingSchema = new mongoose.Schema(
  {
    kode: { type: String, required: true, unique: true }, // contoh: HPS-2026-001
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lapangan: { type: mongoose.Schema.Types.ObjectId, ref: 'Lapangan', required: true },

    tanggal: { type: String, required: true }, // 'YYYY-MM-DD'
    jamMulai: { type: String, required: true }, // '16:00'
    durasi: { type: Number, required: true }, // dalam menit (60 / 90 / 120)

    // Data kontak yang diisi di halaman pembayaran
    nama: { type: String, required: true },
    email: { type: String, required: true },
    metode: { type: String, default: 'qris' },

    harga: {
      sewa: Number,
      layanan: Number,
      total: Number,
    },

    // Pending = menunggu verifikasi admin, Approved = disetujui,
    // Rejected = ditolak admin, Cancelled = dibatalkan user
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true, collection: 'bookings' }
)

bookingSchema.plugin(ubahJSON)

module.exports = mongoose.model('Booking', bookingSchema)
