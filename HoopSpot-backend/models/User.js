const mongoose = require('mongoose')
const ubahJSON = require('./ubahJSON')

const userSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tel: { type: String, required: true, trim: true },
    lokasi: { type: String, default: '' },
    // select: false -> password tidak ikut terambil kecuali diminta .select('+password')
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
)

userSchema.plugin(ubahJSON)

module.exports = mongoose.model('User', userSchema)
