const express = require('express')
const Lapangan = require('../models/Lapangan')
const Booking = require('../models/Booking')
const { auth } = require('../middleware/auth')
const {
  SLOTS, DURASI, METODE, STATUS_AKTIF,
  hitungHarga, waktuMulai, tanggalValid, emailValid, dataBooking,
} = require('../helpers')

const router = express.Router()

router.use(auth) // semua endpoint booking wajib login

// Kode booking berurutan, contoh: HPS-2026-016
async function buatKode() {
  const tahun = new Date().getFullYear()
  let nomor = (await Booking.countDocuments()) + 1
  let kode = `HPS-${tahun}-${String(nomor).padStart(3, '0')}`
  while (await Booking.exists({ kode })) {
    nomor++
    kode = `HPS-${tahun}-${String(nomor).padStart(3, '0')}`
  }
  return kode
}

// POST /api/booking
// body: { lapanganId, tanggal, slot, durasi, nama, email, metode }
// (nama field sama dengan query yang dikirim halaman pembayaran)
router.post('/', async (req, res) => {
  const { lapanganId, tanggal, slot, durasi, nama, email, metode = 'qris' } = req.body

  // ---- validasi ----
  if (!lapanganId) return res.status(400).json({ message: 'Lapangan wajib dipilih' })
  if (!tanggalValid(tanggal)) return res.status(400).json({ message: 'Tanggal tidak valid (YYYY-MM-DD)' })
  if (!SLOTS.includes(slot)) return res.status(400).json({ message: `Slot harus salah satu dari: ${SLOTS.join(', ')}` })
  if (!DURASI.includes(Number(durasi))) return res.status(400).json({ message: `Durasi harus salah satu dari: ${DURASI.join(', ')} menit` })
  if (!nama || !nama.trim()) return res.status(400).json({ message: 'Nama lengkap wajib diisi' })
  if (!emailValid(email)) return res.status(400).json({ message: 'Masukkan alamat email yang valid' })
  if (!METODE.includes(metode)) return res.status(400).json({ message: 'Metode pembayaran tidak dikenal' })

  const lapangan = await Lapangan.findById(lapanganId)
  if (!lapangan) return res.status(404).json({ message: 'Lapangan tidak ditemukan' })

  if (waktuMulai(tanggal, slot) <= new Date()) {
    return res.status(400).json({ message: 'Jadwal yang dipilih sudah lewat' })
  }

  // ---- cek slot masih kosong ----
  // Slot di frontend jaraknya minimal 2 jam (durasi maksimal 120 menit),
  // jadi cukup cek apakah jam mulai yang sama sudah dipesan.
  const bentrok = await Booking.findOne({
    lapangan: lapangan._id,
    tanggal,
    jamMulai: slot,
    status: { $in: STATUS_AKTIF },
  })
  if (bentrok) {
    return res.status(409).json({ message: 'Slot ini sudah dipesan. Silakan pilih jam lain.' })
  }

  // ---- simpan ----
  const booking = await Booking.create({
    kode: await buatKode(),
    user: req.user._id,
    lapangan: lapangan._id,
    tanggal,
    jamMulai: slot,
    durasi: Number(durasi),
    nama: nama.trim(),
    email: email.trim(),
    metode,
    harga: hitungHarga(lapangan.harga, Number(durasi)),
  })

  await booking.populate('lapangan')
  res.status(201).json(dataBooking(booking))
})

// GET /api/booking/:id  -> detail booking (untuk halaman konfirmasi)
router.get('/:id', async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('lapangan')

  // Booking milik orang lain dijawab "tidak ditemukan" (admin boleh melihat semua)
  const milikSendiri = booking && String(booking.user) === String(req.user._id)
  if (!booking || (!milikSendiri && req.user.role !== 'admin')) {
    return res.status(404).json({ message: 'Booking tidak ditemukan' })
  }

  res.json(dataBooking(booking))
})

// PATCH /api/booking/:id/batal  -> batalkan booking (minimal 24 jam sebelum main, sesuai FAQ)
router.patch('/:id/batal', async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).populate('lapangan')
  if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' })

  if (!STATUS_AKTIF.includes(booking.status)) {
    return res.status(400).json({ message: `Booking berstatus ${booking.status} tidak dapat dibatalkan` })
  }

  const selisihJam = (waktuMulai(booking.tanggal, booking.jamMulai) - new Date()) / (1000 * 60 * 60)
  if (selisihJam < 24) {
    return res.status(400).json({ message: 'Pembatalan minimal 24 jam sebelum jadwal bermain' })
  }

  booking.status = 'Cancelled'
  await booking.save()
  res.json(dataBooking(booking))
})

module.exports = router
