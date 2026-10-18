import { z } from 'zod'
import { Booking } from '../models/Booking.js'
import { Lapangan } from '../models/Lapangan.js'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import {
  ACTIVE_STATUSES,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  ROLE,
} from '../config/constants.js'
import { nowMinutesWIB, toMinutes, todayWIB } from '../utils/time.js'
import { idParam, tanggalSchema } from '../utils/validators.js'
import { releaseExpiredHolds } from '../services/booking.service.js'

/** GET /api/admin/stats -> 4 kartu statistik, bentuknya sama dengan type `Statistik` di frontend */
export const stats = async (req, res) => {
  await releaseExpiredHolds()

  const [pendapatan, totalBooking, userAktif, menunggu] = await Promise.all([
    Booking.aggregate([
      { $match: { 'pembayaran.status': PAYMENT_STATUS.PAID } },
      { $group: { _id: null, total: { $sum: '$biaya.total' } } },
    ]),
    Booking.countDocuments({ status: BOOKING_STATUS.APPROVED }),
    User.countDocuments({ role: ROLE.USER, isActive: true }),
    Booking.countDocuments({ status: BOOKING_STATUS.PENDING }),
  ])

  res.json([
    { judul: 'Total Revenue', jumlah: pendapatan[0]?.total ?? 0 },
    { judul: 'Total Booking', jumlah: totalBooking },
    { judul: 'Active Users', jumlah: userAktif },
    { judul: 'Pending Requests', jumlah: menunggu },
  ])
}

const listQuery = z.object({
  status: z.enum(Object.values(BOOKING_STATUS)).optional(),
  tanggal: tanggalSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/** GET /api/admin/booking -> daftar booking, bentuknya sama dengan type `DaftarBooking` + beberapa field tambahan */
export const listBookings = async (req, res) => {
  const { status, tanggal, limit } = listQuery.parse(req.query)
  await releaseExpiredHolds()

  const filter = {}
  if (status) filter.status = status
  if (tanggal) filter.tanggal = tanggal

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'nama email tel')
    .populate('lapangan', 'judul')

  res.json(
    bookings.map((b) => ({
      id: b.id,
      kodeBooking: b.kodeBooking,
      user: b.user?.nama ?? '(user dihapus)',
      court: b.lapangan?.judul ?? '(lapangan dihapus)',
      tanggal: b.tanggal,
      timeSlot: { start: b.jamMulai, end: b.jamSelesai },
      status: b.status,
      statusPembayaran: b.pembayaran.status,
      total: b.biaya.total,
    })),
  )
}

const statusSchema = z.object({
  status: z.enum([BOOKING_STATUS.APPROVED, BOOKING_STATUS.REJECTED], 'Status harus Approved atau Rejected'),
  alasan: z.string().trim().max(300).optional(),
})

// Perpindahan status yang diizinkan untuk admin
const TRANSISI = {
  [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.APPROVED, BOOKING_STATUS.REJECTED],
  [BOOKING_STATUS.APPROVED]: [BOOKING_STATUS.REJECTED],
}

/** PATCH /api/admin/booking/:id/status -> setujui / tolak booking */
export const updateBookingStatus = async (req, res) => {
  const { id } = idParam.parse(req.params)
  const { status, alasan } = statusSchema.parse(req.body)

  await releaseExpiredHolds({ _id: id })
  const booking = await Booking.findById(id)
  if (!booking) throw new ApiError(404, 'Booking tidak ditemukan')

  if (!TRANSISI[booking.status]?.includes(status)) {
    throw new ApiError(409, `Booking berstatus ${booking.status} tidak dapat diubah menjadi ${status}`)
  }

  booking.status = status
  booking.expiresAt = undefined
  if (alasan) booking.alasan = alasan
  if (status === BOOKING_STATUS.REJECTED && booking.pembayaran.status === PAYMENT_STATUS.PAID) {
    booking.pembayaran.status = PAYMENT_STATUS.REFUNDED
  }
  await booking.save()

  res.json({ id: booking.id, kodeBooking: booking.kodeBooking, status: booking.status })
}

/**
 * GET /api/admin/lapangan/status -> kartu "Court Status" di dashboard.
 * status: Available | Booked | Closed
 * sampai: Available = kosong sampai jam berapa, Booked = selesai jam berapa, Closed = buka jam berapa
 */
export const courtStatus = async (req, res) => {
  await releaseExpiredHolds()
  const hariIni = todayWIB()
  const sekarang = nowMinutesWIB()

  const [courts, bookings] = await Promise.all([
    Lapangan.find({ isActive: true }).sort({ judul: 1 }),
    Booking.find({ tanggal: hariIni, status: { $in: ACTIVE_STATUSES } })
      .select('lapangan jamMulai jamSelesai')
      .sort({ jamMulai: 1 }),
  ])

  res.json(
    courts.map((c) => {
      const info = { id: c.id, judul: c.judul, tipe: c.tipe }
      const buka = toMinutes(c.jamBuka)
      const tutup = toMinutes(c.jamTutup)

      if (sekarang < buka) return { ...info, status: 'Closed', sampai: c.jamBuka }
      if (sekarang >= tutup) return { ...info, status: 'Closed', sampai: null }

      const miliknya = bookings.filter((b) => String(b.lapangan) === String(c._id))
      const sedangMain = miliknya.find(
        (b) => toMinutes(b.jamMulai) <= sekarang && sekarang < toMinutes(b.jamSelesai),
      )
      if (sedangMain) return { ...info, status: 'Booked', sampai: sedangMain.jamSelesai }

      const berikutnya = miliknya.find((b) => toMinutes(b.jamMulai) > sekarang)
      return { ...info, status: 'Available', sampai: berikutnya?.jamMulai ?? c.jamTutup }
    }),
  )
}
