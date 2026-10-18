import mongoose from 'mongoose'
import { normalizeJSON } from './plugins.js'

const testimoniSchema = new mongoose.Schema(
  {
    namaUser: { type: String, required: true, trim: true },
    testimo: { type: String, required: true, trim: true }, // isi testimoni
    rating: { type: Number, min: 1, max: 5, default: 5 },
    profil: { type: String, default: '' }, // path/URL foto
    urutan: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'testimoni' },
)

testimoniSchema.plugin(normalizeJSON)

export const Testimoni = mongoose.model('Testimoni', testimoniSchema)
