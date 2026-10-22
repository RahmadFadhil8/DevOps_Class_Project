const mongoose = require('mongoose')
const ubahJSON = require('./ubahJSON')

const lapanganSchema = new mongoose.Schema(
  {
    judul: { type: String, required: true },
    alamat: { type: String, required: true },
    tipe: { type: String, enum: ['Indoor', 'Outdoor'], default: 'Indoor' },
    harga: { type: Number, required: true }, // harga PER JAM (rupiah)
    rating: { type: Number, default: 0 },
    gambar: { type: String, default: '' },
    deskripsi: { type: String, default: '' },
    fasilitas: { type: [String], default: [] },
  },
  { timestamps: true, collection: 'lapangan' }
)

lapanganSchema.plugin(ubahJSON)

module.exports = mongoose.model('Lapangan', lapanganSchema)
