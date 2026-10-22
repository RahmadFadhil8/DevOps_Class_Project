const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { auth } = require('../middleware/auth')
const { dataUser, emailValid } = require('../helpers')

const router = express.Router()

// POST /api/auth/register  body: { nama, email, tel, password }
router.post('/register', async (req, res) => {
  const { nama, email, tel, password } = req.body

  if (!nama || !nama.trim()) return res.status(400).json({ message: 'Nama wajib diisi' })
  if (!emailValid(email)) return res.status(400).json({ message: 'Format email tidak valid' })
  if (!tel || !tel.trim()) return res.status(400).json({ message: 'Nomor telepon wajib diisi' })
  if (!password || password.length < 8) {
    return res.status(400).json({ message: 'Password minimal 8 karakter' })
  }

  const sudahAda = await User.findOne({ email: email.toLowerCase() })
  if (sudahAda) return res.status(409).json({ message: 'Email sudah terdaftar' })

  // Password tidak boleh disimpan apa adanya, jadi di-hash dulu
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ nama, email, tel, password: passwordHash })

  res.status(201).json({ message: 'Registrasi berhasil', user: dataUser(user) })
})

// POST /api/auth/login  body: { email, password }
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!emailValid(email) || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' })
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  const cocok = user && (await bcrypt.compare(password, user.password))
  if (!cocok) return res.status(401).json({ message: 'Email atau password salah' })

  // Token dikirim ke frontend, lalu dipakai di header Authorization untuk request berikutnya
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

  res.json({ message: 'Login berhasil', user: dataUser(user), token })
})

// POST /api/auth/logout
router.post('/logout', auth, async (req, res) => {
  try {
    // Jika Anda menggunakan blacklist token / Redis, token bisa dicabut di sini.
    // Karena menggunakan JWT stateless standar, cukup berikan respons sukses 
    // dan biarkan frontend menghapus token dari storage/cookie.
    res.json({ message: 'Logout berhasil' })
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan saat logout' })
  }
})

// GET /api/auth/me  -> data user yang sedang login
router.get('/me', auth, (req, res) => {
  res.json({ user: dataUser(req.user) })
})

module.exports = router
