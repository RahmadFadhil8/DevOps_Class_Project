import mongoose from 'mongoose'
import {
  ACTIVE_STATUSES,
  BOOKING_STATUS,
  DURATIONS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
} from '../config/constants.js'
import { normalizeJSON } from './plugins.js'

const { ObjectId } = mongoose.Schema.Types

const bookingSchema = new mongoose.Schema(
  {
    kodeBooking: { type: String, required: true, unique: true }, // HS-20261017-001
    user: { type: ObjectId, ref: 'User', required: true },
    lapangan: { type: ObjectId, ref: 'Lapangan', required: true },

    // Waktu disimpan sebagai teks WIB supaya tidak kena masalah timezone.
    // 'HH:mm' berpadding nol, jadi bisa dibandingkan langsung sebagai string.
    tanggal: { type: String, required: true }, // 'YYYY-MM-DD'
    jamMulai: { type: String, required: true }, // 'HH:mm'
    jamSelesai: { type: String, required: true }, // 'HH:mm'
    durasi: { type: Number, enum: DURATIONS, required: true }, // menit
    mulaiAt: { type: Date, required: true }, // waktu mulai sebagai Date (untuk aturan batal 24 jam)

    kontak: { nama: String, email: String },

    biaya: {
      sewa: { type: Number, required: true },
      layanan: { type: Number, required: true },
      total: { type: Number, required: true },
    },

    status: { type: String, enum: Object.values(BOOKING_STATUS), default: BOOKING_STATUS.PENDING },

    pembayaran: {
      metode: { type: String, enum: PAYMENT_METHODS, default: 'QRIS' },
      status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.UNPAID },
      dibayarAt: Date,
    },

    expiresAt: Date, // batas bayar untuk status Pending
    alasan: String, // alasan ditolak / dibatalkan
  },
  { timestamps: true, collection: 'bookings' },
)

// Lapis pengaman terakhir terhadap double booking: dua booking aktif tidak boleh
// punya lapangan + tanggal + jam mulai yang sama (kalau dua request masuk bersamaan).
// Catatan: butuh MongoDB 6.0+ karena memakai $in di partialFilterExpression.
bookingSchema.index(
  { lapangan: 1, tanggal: 1, jamMulai: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ACTIVE_STATUSES } } },
)
bookingSchema.index({ user: 1, mulaiAt: -1 })
bookingSchema.index({ status: 1, expiresAt: 1 })

bookingSchema.plugin(normalizeJSON)

export const Booking = mongoose.model('Booking', bookingSchema)
