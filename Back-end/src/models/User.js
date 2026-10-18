import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { ROLE } from '../config/constants.js'
import { normalizeJSON } from './plugins.js'

const userSchema = new mongoose.Schema(
  {
    nama: { type: String, required: [true, 'Nama wajib diisi'], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    tel: { type: String, required: [true, 'Nomor telepon wajib diisi'], trim: true },
    // select:false -> password tidak ikut ter-query kecuali diminta lewat .select('+password')
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(ROLE), default: ROLE.USER },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'users' },
)

userSchema.plugin(normalizeJSON)

// Hash password otomatis setiap kali password diubah/dibuat
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

export const User = mongoose.model('User', userSchema)
