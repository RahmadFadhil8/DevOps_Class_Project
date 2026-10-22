require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    if (ret._id) {
      ret.id = String(ret._id)
      delete ret._id
    }
  },
})

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('MONGODB_URI atau JWT_SECRET belum diisi. Salin .env.example menjadi .env lalu isi nilainya.')
  process.exit(1)
}

const app = express()

// ---- middleware ----
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }))
app.use(express.json())
app.use((req, res, next) => {
  req.body = req.body || {} // Express 5: req.body bisa undefined kalau tidak ada body
  console.log(req.method, req.url)
  next()
})

// ---- routes ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})
app.use('/api/auth', require('./routes/auth'))
app.use('/api/lapangan', require('./routes/lapangan'))
app.use('/api/booking', require('./routes/booking'))
app.use('/api/profile', require('./routes/profile'))
app.use('/api/favorit', require('./routes/favorit'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api', require('./routes/konten')) // /api/testimoni dan /api/faq

// ---- endpoint tidak ada ----
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' })
})

// ---- penanganan error ----
// Express 5 otomatis meneruskan error dari async handler ke sini
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'ID tidak valid' })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message })
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Data sudah ada' })
  }
  console.error(err)
  res.status(500).json({ message: 'Terjadi kesalahan pada server' })
})

// ---- jalankan ----
const PORT = process.env.PORT || 4000

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB terhubung:', mongoose.connection.name)
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`))
  })
  .catch((error) => {
    console.error('Gagal terhubung ke MongoDB:', error.message)
    console.error('Pastikan MongoDB sudah berjalan dan MONGODB_URI di .env benar.')
    process.exit(1)
  })
