import mongoose from 'mongoose'
import { normalizeJSON } from './plugins.js'

const faqSchema = new mongoose.Schema(
  {
    pertanyaan: { type: String, required: true, trim: true },
    jawaban: { type: String, required: true, trim: true },
    urutan: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'faq' },
)

faqSchema.plugin(normalizeJSON)

export const Faq = mongoose.model('Faq', faqSchema)
