const express = require('express')
const User = require('../models/User')
const Lapangan = require('../models/Lapangan')
const Booking = require('../models/Booking')
const { auth, adminOnly } = require('../middleware/auth')
const { STATUS_AKTIF, hitungJamSelesai, sekarangWIB } = require('../helpers')

const router = express.Router()

router.use(auth, adminOnly) // semua endpoint di sini khusus admin

// '16:30' -> 990 (menit sejak 00:00), untuk membandingkan jam
const keMenit = (jam) => Number(jam.slice(0, 2)) * 60 + Number(jam.slice(3, 5))

// GET /api/admin/stats  -> 4 kartu statistik di dashboard (bentuk sama dengan type Statistik)
router.get('/stats', async (req, res) => {
  const disetujui = await Booking.find({ status: 'Approved' })
  const pendapatan = disetujui.reduce((total, b) => total + b.harga.total, 0)

  res.json([
    { judul: 'Total Revenue', jumlah: pendapatan },
    { judul: 'Total Booking', jumlah: disetujui.length },
    { judul: 'Active Users', jumlah: await User.countDocuments({ role: 'user' }) },
    { judul: 'Pending Requests', jumlah: await Booking.countDocuments({ status: 'Pending' }) },
  ])
})

// GET /api/admin/booking?status=Pending  -> tabel booking (bentuk sama dengan type DaftarBooking)
router.get('/booking', async (req, res) => {
  const filter = {}
  if (req.query.status) filter.status = req.query.status

  const bookings = await Booking.find(filter)
    .populate('user', 'nama')
    .populate('lapangan', 'judul')
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 20)

  res.json(
    bookings.map((b) => ({
      id: String(b._id),
      kode: b.kode,
      user: b.user ? b.user.nama : '-',
      court: b.lapangan ? b.lapangan.judul : '-',
      tanggal: b.tanggal,
      timeSlot: { start: b.jamMulai, end: hitungJamSelesai(b.jamMulai, b.durasi) },
      status: b.status,
    }))
  )
})

// PATCH /api/admin/booking/:id  body: { status: "Approved" | "Rejected" }
router.patch('/booking/:id', async (req, res) => {
  const { status } = req.body
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status harus Approved atau Rejected' })
  }

  const booking = await Booking.findById(req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking tidak ditemukan' })

  if (!STATUS_AKTIF.includes(booking.status)) {
    return res.status(400).json({ message: `Booking berstatus ${booking.status} tidak dapat diubah` })
  }

  booking.status = status
  await booking.save()
  res.json({ id: String(booking._id), kode: booking.kode, status: booking.status })
})

// GET /api/admin/lapangan/status  -> kartu "Court Status": tiap lapangan sedang kosong atau terpakai hari ini
router.get('/lapangan/status', async (req, res) => {
  const { tanggal, menit } = sekarangWIB()
  const lapangan = await Lapangan.find().sort({ judul: 1 })
  const hariIni = await Booking.find({ tanggal, status: { $in: STATUS_AKTIF } }).sort({ jamMulai: 1 })

  res.json(
    lapangan.map((l) => {
      const miliknya = hariIni.filter((b) => String(b.lapangan) === String(l._id))

      // sedang dipakai = jam sekarang ada di antara jam mulai dan jam selesai
      const sedangDipakai = miliknya.find((b) => {
        const mulai = keMenit(b.jamMulai)
        return mulai <= menit && menit < mulai + b.durasi
      })
      if (sedangDipakai) {
        return {
          id: String(l._id),
          judul: l.judul,
          tipe: l.tipe,
          status: 'Booked',
          sampai: hitungJamSelesai(sedangDipakai.jamMulai, sedangDipakai.durasi),
        }
      }

      // kosong sampai booking berikutnya (null = tidak ada lagi booking hari ini)
      const berikutnya = miliknya.find((b) => keMenit(b.jamMulai) > menit)
      return {
        id: String(l._id),
        judul: l.judul,
        tipe: l.tipe,
        status: 'Available',
        sampai: berikutnya ? berikutnya.jamMulai : null,
      }
    })
  )
})

module.exports = router
