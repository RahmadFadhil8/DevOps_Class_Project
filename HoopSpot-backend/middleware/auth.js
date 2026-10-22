const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Wajib login: baca token dari header "Authorization: Bearer <token>"
async function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Silakan login terlebih dahulu' })
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(data.id)
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau sudah kedaluwarsa' })
  }

  if (!req.user) {
    return res.status(401).json({ message: 'Akun tidak ditemukan' })
  }

  next()
}

// Khusus admin (pakai setelah auth)
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Hanya admin yang boleh mengakses ini' })
  }
  next()
}

module.exports = { auth, adminOnly }
