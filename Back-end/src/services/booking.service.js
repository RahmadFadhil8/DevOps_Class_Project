import { Booking } from '../models/Booking.js'
import { nextSeq } from '../models/Counter.js'
import {
  ACTIVE_STATUSES,
  BOOKING_STATUS,
  SERVICE_FEE,
  SLOT_STARTS,
} from '../config/constants.js'
import { toDate, toHHmm, toMinutes, todayWIB } from '../utils/time.js'

/** Harga lapangan itu per jam: sewa = harga x durasi / 60. */
export const hitungBiaya = (harga, durasi) => {
  const sewa = Math.round((harga * durasi) / 60)
  return { sewa, layanan: SERVICE_FEE, total: sewa + SERVICE_FEE }
}

/** Kode booking berurutan per hari, mis. HS-20261017-001 (atomic via collection counters). */
export async function buatKodeBooking(now = new Date()) {
  const ymd = todayWIB(now).replaceAll('-', '')
  const seq = await nextSeq(`booking-${ymd}`)
  return `HS-${ymd}-${String(seq).padStart(3, '0')}`
}

/**
 * Lepas slot dari booking Pending yang tidak dibayar sampai batas waktu.
 * Dipanggil sebelum cek ketersediaan dan secara berkala dari server.js.
 */
export function releaseExpiredHolds(filter = {}) {
  return Booking.updateMany(
    { ...filter, status: BOOKING_STATUS.PENDING, expiresAt: { $lte: new Date() } },
    { $set: { status: BOOKING_STATUS.EXPIRED } },
  )
}

/** Daftar slot waktu (sama dengan di frontend) beserta ketersediaannya untuk 1 lapangan di 1 tanggal. */
export async function hitungSlot(lapangan, tanggal, durasi) {
  await releaseExpiredHolds({ lapangan: lapangan._id, tanggal })

  const terpakai = await Booking.find({
    lapangan: lapangan._id,
    tanggal,
    status: { $in: ACTIVE_STATUSES },
  }).select('jamMulai jamSelesai')

  const buka = toMinutes(lapangan.jamBuka)
  const tutup = toMinutes(lapangan.jamTutup)
  const sekarang = new Date()

  return SLOT_STARTS.map((start) => {
    const s = toMinutes(start)
    const e = s + durasi
    const jamSelesai = toHHmm(e)

    const sudahLewat = toDate(tanggal, start) <= sekarang
    const diLuarJam = s < buka || e > tutup
    const bentrok = terpakai.some((b) => toMinutes(b.jamMulai) < e && toMinutes(b.jamSelesai) > s)

    return {
      label: `${start} - ${jamSelesai}`,
      value: start,
      jamSelesai,
      tersedia: !sudahLewat && !diLuarJam && !bentrok,
    }
  })
}

/** Bentuk response booking yang rapi untuk frontend. Idealnya `lapangan` sudah di-populate. */
export function serializeBooking(booking) {
  const o = booking.toObject()
  const l = booking.lapangan

  return {
    id: booking.id,
    kodeBooking: o.kodeBooking,
    lapangan:
      l && l.judul
        ? { id: String(l._id), judul: l.judul, alamat: l.alamat, gambar: l.gambar, harga: l.harga }
        : { id: String(l?._id ?? l) },
    tanggal: o.tanggal,
    jamMulai: o.jamMulai,
    jamSelesai: o.jamSelesai,
    durasi: o.durasi,
    timeSlot: { start: o.jamMulai, end: o.jamSelesai },
    kontak: o.kontak,
    biaya: o.biaya,
    status: o.status,
    pembayaran: o.pembayaran,
    expiresAt: o.expiresAt,
    alasan: o.alasan,
    createdAt: o.createdAt,
  }
}
