import { z } from 'zod'
import { Lapangan } from '../models/Lapangan.js'
import { ApiError } from '../utils/ApiError.js'
import { COURT_TYPES, DURATIONS } from '../config/constants.js'
import { toMinutes } from '../utils/time.js'
import { hitungSlot } from '../services/booking.service.js'
import {
  escapeRegex,
  idParam,
  jamSchema,
  optionalInt,
  tanggalSchema,
} from '../utils/validators.js'

/* ----------------------------- Publik ----------------------------- */

const listQuery = z
  .object({
    q: z.string().trim().optional(), // cari di nama / alamat
    tipe: z.enum(COURT_TYPES, 'Tipe harus Indoor atau Outdoor').optional(), // kosongkan untuk "Semua Tipe"
    hargaMin: optionalInt,
    hargaMax: optionalInt,
    sort: z.enum(['rating', 'harga-asc', 'harga-desc', 'terbaru']).default('rating'),
  })
  .refine((d) => d.hargaMin === undefined || d.hargaMax === undefined || d.hargaMin <= d.hargaMax, {
    message: 'hargaMin tidak boleh lebih besar dari hargaMax',
    path: ['hargaMin'],
  })

const SORTS = {
  rating: { rating: -1, jumlahReview: -1 },
  'harga-asc': { harga: 1 },
  'harga-desc': { harga: -1 },
  terbaru: { createdAt: -1 },
}

export const list = async (req, res) => {
  const { q, tipe, hargaMin, hargaMax, sort } = listQuery.parse(req.query)

  const filter = { isActive: true }
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i')
    filter.$or = [{ judul: rx }, { alamat: rx }]
  }
  if (tipe) filter.tipe = tipe
  if (hargaMin !== undefined || hargaMax !== undefined) {
    filter.harga = {}
    if (hargaMin !== undefined) filter.harga.$gte = hargaMin
    if (hargaMax !== undefined) filter.harga.$lte = hargaMax
  }

  res.json(await Lapangan.find(filter).sort(SORTS[sort]))
}

const findActive = async (id) => {
  const lapangan = await Lapangan.findOne({ _id: id, isActive: true })
  if (!lapangan) throw new ApiError(404, 'Lapangan tidak ditemukan')
  return lapangan
}

export const getOne = async (req, res) => {
  const { id } = idParam.parse(req.params)
  res.json(await findActive(id))
}

const availabilityQuery = z.object({
  tanggal: tanggalSchema,
  durasi: z.coerce
    .number('Durasi harus berupa angka')
    .refine((d) => DURATIONS.includes(d), `Durasi harus salah satu dari ${DURATIONS.join(', ')} menit`)
    .default(90),
})

export const availability = async (req, res) => {
  const { id } = idParam.parse(req.params)
  const { tanggal, durasi } = availabilityQuery.parse(req.query)
  const lapangan = await findActive(id)

  res.json({
    lapanganId: lapangan.id,
    tanggal,
    durasi,
    harga: lapangan.harga,
    slots: await hitungSlot(lapangan, tanggal, durasi),
  })
}

/* ------------------------- Admin (CRUD) -------------------------- */

const lapanganBase = z.object({
  judul: z.string().trim().min(1, 'Nama lapangan wajib diisi').max(120),
  alamat: z.string().trim().min(1, 'Alamat wajib diisi').max(200),
  tipe: z.enum(COURT_TYPES, 'Tipe harus Indoor atau Outdoor'),
  harga: z.number({ error: 'Harga wajib diisi (angka)' }).int().min(0, 'Harga tidak boleh negatif'),
  gambar: z.string().trim().max(500),
  deskripsi: z.string().trim().max(3000),
  fasilitas: z.array(z.string().trim().min(1)).max(20),
  jamBuka: jamSchema,
  jamTutup: jamSchema,
})

// Nilai default (tipe, jam buka/tutup, dst.) diurus oleh skema Mongoose
const createSchema = lapanganBase.partial().required({ judul: true, alamat: true, harga: true })
const updateSchema = lapanganBase.partial()

const cekJam = (l) => {
  if (toMinutes(l.jamBuka) >= toMinutes(l.jamTutup)) {
    throw new ApiError(400, 'Jam buka harus lebih awal dari jam tutup')
  }
}

export const create = async (req, res) => {
  const data = createSchema.parse(req.body)
  const lapangan = new Lapangan(data)
  cekJam(lapangan)
  await lapangan.save()
  res.status(201).json(lapangan)
}

export const update = async (req, res) => {
  const { id } = idParam.parse(req.params)
  const data = updateSchema.parse(req.body)

  const lapangan = await findActive(id)
  lapangan.set(data)
  cekJam(lapangan)
  await lapangan.save()
  res.json(lapangan)
}

/** Soft delete: lapangan disembunyikan, riwayat booking tetap utuh. */
export const remove = async (req, res) => {
  const { id } = idParam.parse(req.params)
  const lapangan = await findActive(id)
  lapangan.isActive = false
  await lapangan.save()
  res.json({ message: 'Lapangan berhasil dihapus' })
}
