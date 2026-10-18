import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'
import { ApiError } from '../utils/ApiError.js'
import { emailSchema } from '../utils/validators.js'

// Field sama dengan RegisterDto di frontend: nama, email, tel, password
const registerSchema = z.object({
  nama: z.string({ error: 'Nama wajib diisi' }).trim().min(1, 'Nama wajib diisi').max(100, 'Nama maksimal 100 karakter'),
  email: emailSchema,
  tel: z
    .string({ error: 'Nomor telepon wajib diisi' })
    .trim()
    .transform((s) => s.replace(/[\s-]/g, ''))
    .pipe(z.string().regex(/^(\+62|62|0)8\d{8,12}$/, 'Nomor telepon tidak valid (contoh: 081234567890)')),
  password: z
    .string({ error: 'Password wajib diisi' })
    .min(8, 'Password minimal 8 karakter')
    .max(72, 'Password maksimal 72 karakter'),
})

const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ error: 'Password wajib diisi' }).min(1, 'Password wajib diisi'),
})

const signToken = (user) =>
  jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: String(user._id),
    expiresIn: env.jwtExpiresIn,
    algorithm: 'HS256',
  })

export const register = async (req, res) => {
  const data = registerSchema.parse(req.body) // field di luar skema (mis. `role`) otomatis dibuang

  if (await User.exists({ email: data.email })) {
    throw new ApiError(409, 'Email sudah terdaftar')
  }

  const user = await User.create(data) // role selalu 'user'
  res.status(201).json({ user, token: signToken(user) })
}

export const login = async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)

  const user = await User.findOne({ email }).select('+password')
  // Pesan sengaja sama untuk email tidak ditemukan / password salah
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Email atau password salah')
  }
  if (!user.isActive) {
    throw new ApiError(403, 'Akun Anda dinonaktifkan. Hubungi admin.')
  }

  res.json({ user, token: signToken(user) })
}

export const me = (req, res) => {
  res.json({ user: req.user })
}
