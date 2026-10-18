import mongoose from 'mongoose'
import { COURT_TYPES } from '../config/constants.js'
import { normalizeJSON } from './plugins.js'

const lapanganSchema = new mongoose.Schema(
  {
    judul: { type: String, required: [true, 'Nama lapangan wajib diisi'], trim: true },
    alamat: { type: String, required: [true, 'Alamat wajib diisi'], trim: true },
    tipe: { type: String, enum: COURT_TYPES, default: 'Indoor' },
    // Harga PER JAM (rupiah). Total sewa = harga x durasi / 60
    harga: { type: Number, required: [true, 'Harga wajib diisi'], min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    jumlahReview: { type: Number, default: 0, min: 0 },
    gambar: { type: String, default: '' }, // path/URL gambar, mis. /images/lapangan/1.jpg
    deskripsi: { type: String, default: '' },
    fasilitas: { type: [String], default: [] },
    jamBuka: { type: String, default: '07:00' }, // 'HH:mm' WIB
    jamTutup: { type: String, default: '21:00' },
    isActive: { type: Boolean, default: true }, // false = disembunyikan (soft delete)
  },
  { timestamps: true, collection: 'lapangan' },
)

lapanganSchema.index({ isActive: 1, rating: -1 })

lapanganSchema.plugin(normalizeJSON)

export const Lapangan = mongoose.model('Lapangan', lapanganSchema)
