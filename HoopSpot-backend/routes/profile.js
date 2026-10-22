const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Booking = require('../models/Booking')
const { auth } = require('../middleware/auth')
const { emailValid, hitungJamSelesai, waktuMulai } = require('../helpers')

const router = express.Router()

router.use(auth) // semua endpoint profile wajib login

// Bentuk data sesuai type UserProfile di frontend
function dataProfile(user) {
  return {
    nama: user.nama,
    email: user.email,
    telepon: user.tel,
    lokasi: user.lokasi,
    memberSince: new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(user.createdAt),
    avatar: '',
  }
}

// Frontend profile hanya mengenal 3 status: upcoming, completed, cancelled
function statusProfile(booking) {
  if (booking.status === 'Cancelled' || booking.status === 'Rejected') return 'cancelled'
  const sudahLewat = waktuMulai(booking.tanggal, booking.jamMulai) < new Date()
  return sudahLewat ? 'completed' : 'upcoming'
}

// GET /api/profile
router.get('/', (req, res) => {
  res.json(dataProfile(req.user))
})

// PUT /api/profile  body: { nama, email, telepon, lokasi }
router.put('/', async (req, res) => {
  const { nama, email, telepon, lokasi } = req.body

  if (!nama || !nama.trim()) return res.status(400).json({ message: 'Nama wajib diisi' })
  if (!emailValid(email)) return res.status(400).json({ message: 'Format email tidak valid' })

  // Kalau email diganti, pastikan belum dipakai akun lain
  const dipakai = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user._id } })
  if (dipakai) return res.status(409).json({ message: 'Email sudah dipakai akun lain' })

  req.user.nama = nama.trim()
  req.user.email = email
  req.user.tel = (telepon || '').trim() || req.user.tel
  req.user.lokasi = (lokasi || '').trim()
  await req.user.save()

  res.json(dataProfile(req.user))
})

// PUT /api/profile/password  body: { passwordLama, passwordBaru }
router.put('/password', async (req, res) => {
  const { passwordLama, passwordBaru } = req.body

  if (!passwordLama || !passwordBaru) {
    return res.status(400).json({ message: 'Password lama dan baru wajib diisi' })
  }
  if (passwordBaru.length < 8) {
    return res.status(400).json({ message: 'Password baru minimal 8 karakter' })
  }

  // req.user dari middleware tidak membawa password, jadi ambil ulang
  const user = await User.findById(req.user._id).select('+password')
  if (!(await bcrypt.compare(passwordLama, user.password))) {
    return res.status(400).json({ message: 'Password lama salah' })
  }

  user.password = await bcrypt.hash(passwordBaru, 10)
  await user.save()
  res.json({ message: 'Password berhasil diperbarui' })
})

// GET /api/profile/booking  -> riwayat booking, bentuknya sama dengan type Booking di types/profile.ts
router.get('/booking', async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('lapangan')
    .sort({ tanggal: -1 })

  res.json(
    bookings.map((b) => ({
      id: String(b._id),
      kode: b.kode,
      namaLapangan: b.lapangan.judul,
      lokasi: b.lapangan.alamat,
      tanggal: b.tanggal,
      jam: `${b.jamMulai} - ${hitungJamSelesai(b.jamMulai, b.durasi)}`,
      durasi: b.durasi / 60, // frontend menampilkan dalam jam
      harga: b.harga.total,
      status: statusProfile(b),
      gambar: b.lapangan.gambar,
    }))
  )
})

module.exports = router
