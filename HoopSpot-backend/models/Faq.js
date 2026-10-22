const mongoose = require('mongoose')
const ubahJSON = require('./ubahJSON')

const faqSchema = new mongoose.Schema(
  {
    pertanyaan: { type: String, required: true },
    jawaban: { type: String, required: true },
    urutan: { type: Number, default: 0 },
  },
  { collection: 'faq' }
)

faqSchema.plugin(ubahJSON)

module.exports = mongoose.model('Faq', faqSchema)
