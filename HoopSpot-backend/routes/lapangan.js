const express = require('express')
const Lapangan = require('../models/Lapangan')
const Booking = require('../models/Booking')
const { SLOTS, STATUS_AKTIF, waktuMulai, tanggalValid } = require('../helpers')

const router = express.Router()

// GET /api/lapangan?q=&tipe=&hargaMin=&hargaMax=
router.get('/', async (req, res) => {
  const { q, tipe, hargaMin, hargaMax } = req.query
  const filter = {}

  if (q) {
    // escape karakter khusus supaya aman dipakai di regex
    const kata = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ judul: kata }, { alamat: kata }]
  }
  if (tipe && tipe !== 'Semua Tipe') filter.tipe = tipe
  if (hargaMin) filter.harga = { ...filter.harga, $gte: Number(hargaMin) }
  if (hargaMax) filter.harga = { ...filter.harga, $lte: Number(hargaMax) }

  const data = await Lapangan.find(filter).sort({ rating: -1 })
  res.json(data)
})

// GET /api/lapangan/:id
router.get('/:id', async (req, res) => {
  const lapangan = await Lapangan.findById(req.params.id)
  if (!lapangan) return res.status(404).json({ message: 'Lapangan tidak ditemukan' })
  res.json(lapangan)
})

// GET /api/lapangan/:id/availability?tanggal=2026-10-25
// Menampilkan slot jam mana saja yang masih kosong pada tanggal itu
router.get('/:id/availability', async (req, res) => {
  const { tanggal } = req.query
  if (!tanggalValid(tanggal)) {
    return res.status(400).json({ message: 'Tanggal harus berformat YYYY-MM-DD' })
  }

  const lapangan = await Lapangan.findById(req.params.id)
  if (!lapangan) return res.status(404).json({ message: 'Lapangan tidak ditemukan' })

  const terisi = await Booking.find({
    lapangan: lapangan._id,
    tanggal,
    status: { $in: STATUS_AKTIF },
  })
  const jamTerisi = terisi.map((b) => b.jamMulai)
  const sekarang = new Date()

  const slots = SLOTS.map((jam) => ({
    jam,
    // tersedia = belum dipesan orang lain DAN belum lewat
    tersedia: !jamTerisi.includes(jam) && waktuMulai(tanggal, jam) > sekarang,
  }))

  res.json({ lapanganId: String(lapangan._id), tanggal, slots })
})

module.exports = router
