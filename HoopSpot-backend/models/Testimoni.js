const mongoose = require('mongoose')
const ubahJSON = require('./ubahJSON')

const testimoniSchema = new mongoose.Schema(
  {
    namaUser: { type: String, required: true },
    testimo: { type: String, required: true },
    rating: { type: Number, default: 5 },
    profil: { type: String, default: '' }, // path foto
    urutan: { type: Number, default: 0 },
  },
  { collection: 'testimoni' }
)

testimoniSchema.plugin(ubahJSON)

module.exports = mongoose.model('Testimoni', testimoniSchema)
