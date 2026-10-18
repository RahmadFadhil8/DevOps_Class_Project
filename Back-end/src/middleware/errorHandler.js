import { ZodError } from 'zod'
import mongoose from 'mongoose'
import { ApiError } from '../utils/ApiError.js'
import { env } from '../config/env.js'

export const notFound = (req, res) => {
  res.status(404).json({ message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan` })
}

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Body JSON rusak / terlalu besar
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Format JSON tidak valid' })
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Data yang dikirim terlalu besar' })
  }

  // Error yang kita lempar sendiri
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors })
  }

  // Validasi zod -> pesan pertama dijadikan `message` supaya langsung bisa di-alert di frontend
  if (err instanceof ZodError) {
    const errors = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }))
    return res.status(400).json({ message: errors[0]?.message || 'Data tidak valid', errors })
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }))
    return res.status(400).json({ message: errors[0]?.message || 'Data tidak valid', errors })
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'ID tidak valid' })
  }

  // Unique index dilanggar (email kembar, slot kembar, dst.)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0]
    const message =
      field === 'email'
        ? 'Email sudah terdaftar'
        : field === 'jamMulai'
          ? 'Slot ini baru saja dipesan orang lain. Silakan pilih jam lain.'
          : 'Data sudah ada'
    return res.status(409).json({ message })
  }

  console.error(err)
  res.status(500).json({
    message: 'Terjadi kesalahan pada server',
    ...(env.isProd ? {} : { detail: err.message }),
  })
}
