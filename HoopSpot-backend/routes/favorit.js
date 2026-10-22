const express = require('express')
const Favorit = require('../models/Favorit')
const Lapangan = require('../models/Lapangan')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.use(auth)

// GET /api/favorit  -> bentuknya sama dengan type FavoriteCourt di frontend
router.get('/', async (req, res) => {
  const data = await Favorit.find({ user: req.user._id }).populate('lapangan').sort({ createdAt: -1 })

  res.json(
    data
      .filter((f) => f.lapangan) // lewati kalau lapangannya sudah terhapus
      .map((f) => ({
        id: String(f.lapangan._id),
        nama: f.lapangan.judul,
        lokasi: f.lapangan.alamat,
        harga: f.lapangan.harga,
        rating: f.lapangan.rating,
        gambar: f.lapangan.gambar,
        fasilitas: f.lapangan.fasilitas,
      }))
  )
})

// POST /api/favorit/:lapanganId  -> tambah ke favorit
router.post('/:lapanganId', async (req, res) => {
  const lapangan = await Lapangan.findById(req.params.lapanganId)
  if (!lapangan) return res.status(404).json({ message: 'Lapangan tidak ditemukan' })

  const sudahAda = await Favorit.findOne({ user: req.user._id, lapangan: lapangan._id })
  if (!sudahAda) await Favorit.create({ user: req.user._id, lapangan: lapangan._id })

  res.status(201).json({ message: 'Ditambahkan ke favorit' })
})

// DELETE /api/favorit/:lapanganId  -> hapus dari favorit
router.delete('/:lapanganId', async (req, res) => {
  await Favorit.deleteOne({ user: req.user._id, lapangan: req.params.lapanganId })
  res.json({ message: 'Dihapus dari favorit' })
})

module.exports = router
