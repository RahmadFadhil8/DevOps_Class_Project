const mongoose = require('mongoose')

const favoritSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lapangan: { type: mongoose.Schema.Types.ObjectId, ref: 'Lapangan', required: true },
  },
  { timestamps: true, collection: 'favorit' }
)

// Satu user tidak boleh memfavoritkan lapangan yang sama dua kali
favoritSchema.index({ user: 1, lapangan: 1 }, { unique: true })

module.exports = mongoose.model('Favorit', favoritSchema)
