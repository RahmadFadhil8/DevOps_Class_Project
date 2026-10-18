import { z } from 'zod'
import { Booking } from '../models/Booking.js'
import { Lapangan } from '../models/Lapangan.js'
import { ApiError } from '../utils/ApiError.js'
import {
  ACTIVE_STATUSES,
  BOOKING_STATUS,
  DURATIONS,
  HOLD_MINUTES,
  MAX_ADVANCE_DAYS,
  MIN_CANCEL_HOURS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  ROLE,
  SLOT_STARTS,
} from '../config/constants.js'
import { addDays, toDate, toHHmm, toMinutes, todayWIB } from '../utils/time.js'
import { emailSchema, idParam, objectId, tanggalSchema } from '../utils/validators.js'
import {
  buatKodeBooking,
  hitungBiaya,
  releaseExpiredHolds,
  serializeBooking,
} from '../services/booking.service.js'

const POPULATE_LAPANGAN = ['lapangan', 'judul alamat gambar harga']

const createSchema = z.object({
  lapanganId: objectId,
  tanggal: tanggalSchema,
  jamMulai: z.enum(SLOT_STARTS, `Jam mulai harus salah satu dari: ${SLOT_STARTS.join(', ')}`),
  durasi: z.coerce
    .number('Durasi wajib diisi')
    .refine((d) => DURATIONS.includes(d), `Durasi harus salah satu dari ${DURATIONS.join(', ')} menit`),
  // Opsional: kalau kosong dipakai data akun yang sedang login
  kontak: z
    .object({
      nama: z.string().trim().min(1, 'Nama kontak wajib diisi').max(100),
      email: emailSchema,
    })
    .partial()
    .optional(),
  metode: z.enum(PAYMENT_METHODS, 'Metode pembayaran tidak didukung').default('QRIS'),
})

/** POST /api/booking  -> buat booking, slot ditahan HOLD_MINUTES menit sambil menunggu pembayaran */
export const create = async (req, res) => {
  const body = createSchema.parse(req.body)

  const lapangan = await Lapangan.findOne({ _id: body.lapanganId, isActive: true })
  if (!lapangan) throw new ApiError(404, 'Lapangan tidak ditemukan')

  const hariIni = todayWIB()
  if (body.tanggal < hariIni) throw new ApiError(400, 'Tanggal booking sudah lewat')
  if (body.tanggal > addDays(hariIni, MAX_ADVANCE_DAYS)) {
    throw new ApiError(400, `Booking maksimal ${MAX_ADVANCE_DAYS} hari ke depan`)
  }

  const mulai = toMinutes(body.jamMulai)
  const selesai = mulai + body.durasi
  const jamSelesai = toHHmm(selesai)

  if (mulai < toMinutes(lapangan.jamBuka) || selesai > toMinutes(lapangan.jamTutup)) {
    throw new ApiError(
      400,
      `Di luar jam operasional lapangan (${lapangan.jamBuka} - ${lapangan.jamTutup})`,
    )
  }

  const mulaiAt = toDate(body.tanggal, body.jamMulai)
  if (mulaiAt <= new Date()) throw new ApiError(400, 'Jam tersebut sudah lewat')

  // Slot dari Pending yang kedaluwarsa dibebaskan dulu, baru cek bentrok.
  // Dua jadwal bentrok kalau mulainya < selesai yang lain DAN selesainya > mulai yang lain.
  await releaseExpiredHolds({ lapangan: lapangan._id, tanggal: body.tanggal })
  const bentrok = await Booking.exists({
    lapangan: lapangan._id,
    tanggal: body.tanggal,
    status: { $in: ACTIVE_STATUSES },
    jamMulai: { $lt: jamSelesai },
    jamSelesai: { $gt: body.jamMulai },
  })
  if (bentrok) throw new ApiError(409, 'Slot ini sudah dipesan. Silakan pilih jam lain.')

  // Kalau dua request masuk bersamaan, unique index di model Booking yang menolak salah satunya (409)
  const booking = await Booking.create({
    kodeBooking: await buatKodeBooking(),
    user: req.user._id,
    lapangan: lapangan._id,
    tanggal: body.tanggal,
    jamMulai: body.jamMulai,
    jamSelesai,
    durasi: body.durasi,
    mulaiAt,
    kontak: {
      nama: body.kontak?.nama || req.user.nama,
      email: body.kontak?.email || req.user.email,
    },
    biaya: hitungBiaya(lapangan.harga, body.durasi),
    pembayaran: { metode: body.metode },
    expiresAt: new Date(Date.now() + HOLD_MINUTES * 60 * 1000),
  })

  await booking.populate(...POPULATE_LAPANGAN)
  res.status(201).json(serializeBooking(booking))
}

const mineQuery = z.object({
  status: z.enum(Object.values(BOOKING_STATUS)).optional(),
})

/** GET /api/booking/saya -> riwayat booking milik user yang login (halaman "Tiket Saya") */
export const mine = async (req, res) => {
  const { status } = mineQuery.parse(req.query)
  await releaseExpiredHolds({ user: req.user._id })

  const filter = { user: req.user._id }
  if (status) filter.status = status

  const bookings = await Booking.find(filter)
    .sort({ mulaiAt: -1 })
    .populate(...POPULATE_LAPANGAN)
  res.json(bookings.map(serializeBooking))
}

// Pemilik booking atau admin. Booking orang lain dijawab 404 (bukan 403) supaya ID tidak bisa ditebak.
const findAccessible = async (req) => {
  const { id } = idParam.parse(req.params)
  await releaseExpiredHolds({ _id: id })

  const booking = await Booking.findById(id).populate(...POPULATE_LAPANGAN)
  const isOwner = booking && String(booking.user) === String(req.user._id)
  if (!booking || (!isOwner && req.user.role !== ROLE.ADMIN)) {
    throw new ApiError(404, 'Booking tidak ditemukan')
  }
  return booking
}

/** GET /api/booking/:id -> detail (dipakai halaman konfirmasi) */
export const getOne = async (req, res) => {
  res.json(serializeBooking(await findAccessible(req)))
}

/**
 * POST /api/booking/:id/bayar
 * SIMULASI pembayaran QRIS: langsung menandai lunas.
 * Saat memakai payment gateway sungguhan (Midtrans/Xendit), logika di bawah ini
 * dipindah ke endpoint webhook yang dipanggil gateway setelah pembayaran sukses.
 */
export const pay = async (req, res) => {
  const booking = await findAccessible(req)
  if (String(booking.user) !== String(req.user._id)) {
    throw new ApiError(403, 'Hanya pemilik booking yang dapat membayar')
  }

  // Update atomik: hanya berhasil jika masih Pending dan belum kedaluwarsa
  const updated = await Booking.findOneAndUpdate(
    { _id: booking._id, status: BOOKING_STATUS.PENDING, expiresAt: { $gt: new Date() } },
    {
      $set: {
        status: BOOKING_STATUS.APPROVED,
        'pembayaran.status': PAYMENT_STATUS.PAID,
        'pembayaran.dibayarAt': new Date(),
      },
      $unset: { expiresAt: 1 },
    },
    { returnDocument: 'after' },
  ).populate(...POPULATE_LAPANGAN)

  if (!updated) {
    if (booking.status === BOOKING_STATUS.APPROVED) throw new ApiError(409, 'Booking ini sudah dibayar')
    if (booking.status === BOOKING_STATUS.EXPIRED) {
      throw new ApiError(410, 'Waktu pembayaran habis. Silakan buat booking baru.')
    }
    throw new ApiError(409, `Booking berstatus ${booking.status} dan tidak dapat dibayar`)
  }

  res.json(serializeBooking(updated))
}

const cancelSchema = z.object({ alasan: z.string().trim().max(300).optional() })

/** PATCH /api/booking/:id/batal -> batalkan booking (aturan: min. 24 jam sebelum main bila sudah dibayar) */
export const cancel = async (req, res) => {
  const { alasan } = cancelSchema.parse(req.body ?? {})
  const booking = await findAccessible(req)

  if (String(booking.user) !== String(req.user._id)) {
    throw new ApiError(403, 'Hanya pemilik booking yang dapat membatalkan')
  }
  if (!ACTIVE_STATUSES.includes(booking.status)) {
    throw new ApiError(409, `Booking berstatus ${booking.status} dan tidak dapat dibatalkan`)
  }
  if (booking.status === BOOKING_STATUS.APPROVED) {
    const sisaJam = (booking.mulaiAt.getTime() - Date.now()) / 36e5
    if (sisaJam < MIN_CANCEL_HOURS) {
      throw new ApiError(
        400,
        `Pembatalan hanya bisa dilakukan minimal ${MIN_CANCEL_HOURS} jam sebelum jadwal main`,
      )
    }
  }

  booking.status = BOOKING_STATUS.CANCELLED
  booking.expiresAt = undefined
  booking.alasan = alasan
  if (booking.pembayaran.status === PAYMENT_STATUS.PAID) {
    booking.pembayaran.status = PAYMENT_STATUS.REFUNDED // penandaan saja; refund dana ditangani di luar sistem ini
  }
  await booking.save()

  res.json(serializeBooking(booking))
}
