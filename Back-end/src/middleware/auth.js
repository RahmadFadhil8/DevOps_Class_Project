import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/User.js'

/** Wajib login. Mengisi req.user dari token Bearer. */
export const protect = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Silakan login terlebih dahulu')
  }

  let payload
  try {
    payload = jwt.verify(header.slice(7), env.jwtSecret, { algorithms: ['HS256'] })
  } catch {
    throw new ApiError(401, 'Sesi tidak valid atau sudah berakhir, silakan login kembali')
  }

  const user = await User.findById(payload.sub)
  if (!user || !user.isActive) {
    throw new ApiError(401, 'Akun tidak ditemukan atau sudah dinonaktifkan')
  }

  req.user = user
  next()
}

/** Batasi akses berdasarkan role. Pakai setelah protect. */
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, 'Anda tidak memiliki akses ke fitur ini')
    }
    next()
  }
