/**
 * Mengisi database dengan dummy data.   Jalankan:  npm run seed
 * PERHATIAN: isi semua collection akan dihapus lalu diisi ulang.
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('./models/User')
const Lapangan = require('./models/Lapangan')
const Booking = require('./models/Booking')
const Favorit = require('./models/Favorit')
const Testimoni = require('./models/Testimoni')
const Faq = require('./models/Faq')
const { hitungHarga } = require('./helpers')

// ------------------------------------------------------------------
// 1. Data
// ------------------------------------------------------------------

// Gambar: salin dari app/assets/images ke public/images/lapangan (lihat README)
const lapanganData = [
  {
    judul: 'Bali Basketball Club',
    alamat: 'Canggu, Bali',
    tipe: 'Outdoor',
    harga: 300000,
    rating: 5.0,
    gambar: '/images/lapangan/1.jpg',
    deskripsi:
      'Bali Basketball Club menawarkan pengalaman bermain basket outdoor & indoor premium di kawasan Canggu. Dengan lantai kayu (parquet) berkualitas internasional dan atmosfer tropis yang nyaman, tempat ini menjadi favorit komunitas basket lokal maupun wisatawan.',
    fasilitas: ['Parkir Luas', 'Ruang Ganti & Locker', 'Shower Air Panas', 'Sewa Bola & Ring Tinggi Standar FIBA', 'Kafe & Lounge'],
  },
  {
    judul: 'Hoop Arena Jakarta',
    alamat: 'Jakarta Selatan',
    tipe: 'Indoor',
    harga: 250000,
    rating: 4.9,
    gambar: '/images/lapangan/2.jpg',
    deskripsi:
      'Hoop Arena Jakarta hadir dengan fasilitas arena basket indoor modern ber-AC di pusat kota. Sangat cocok untuk latihan rutin, sparing komunitas 3x3 maupun 5v5, hingga event turnamen lokal.',
    fasilitas: ['Lantai Parquet Vynil Premium', 'Scoreboard Digital', 'Tribun Penonton', 'Musala', 'Area Food Court'],
  },
  {
    judul: 'Court Side Basketball',
    alamat: 'Bandung',
    tipe: 'Indoor',
    harga: 220000,
    rating: 4.8,
    gambar: '/images/lapangan/3.jpg',
    deskripsi:
      'Court Side Basketball menghadirkan lapangan basket berstandar dengan udara sejuk khas Bandung. Tempat ini dirancang ideal bagi pemain pemula hingga profesional yang ingin mengasah skill dribble dan shooting.',
    fasilitas: ['Ring Basket Adjustable', 'Penyewaan Bola & Rompi Tim', 'Ruang Istirahat Player', 'Kantin & Vending Machine', 'Toilet & Ruang Ganti Bersih'],
  },
  {
    judul: 'Surabaya Basketball Hub',
    alamat: 'Surabaya',
    tipe: 'Indoor',
    harga: 200000,
    rating: 4.7,
    gambar: '/images/lapangan/4.jpg',
    deskripsi:
      'Surabaya Basketball Hub merupakan pusat olahraga modern di Surabaya yang menyediakan lapangan basket indoor serbaguna dengan penerangan pencahayaan LED yang terang dan nyaman untuk main malam.',
    fasilitas: ['Area Parkir Mobil & Motor Luas', 'WiFi Gratis 100 Mbps', 'Penyewaan Lapangan 3x3 & Full Court', 'Tribun Penonton Mini'],
  },
  {
    judul: 'Medan Hoops Center',
    alamat: 'Medan Johor, Medan',
    tipe: 'Indoor',
    harga: 180000,
    rating: 4.6,
    gambar: '/images/lapangan/1.jpg',
    deskripsi:
      'Medan Hoops Center adalah lapangan basket indoor ber-AC dengan lantai vinyl anti selip. Favorit komunitas basket kampus dan kantor di Medan untuk latihan rutin sore hari.',
    fasilitas: ['Parkir Luas', 'Ruang Ganti', 'Kantin', 'Musala'],
  },
  {
    judul: 'Jogja Slam Court',
    alamat: 'Sleman, Yogyakarta',
    tipe: 'Outdoor',
    harga: 150000,
    rating: 4.5,
    gambar: '/images/lapangan/2.jpg',
    deskripsi:
      'Lapangan outdoor beratap dengan permukaan semen yang diaplikasi coating akrilik. Cocok untuk 3x3 santai bersama teman dengan suasana khas Yogyakarta.',
    fasilitas: ['Atap Pelindung Hujan', 'Penyewaan Bola', 'Warung Minuman', 'Toilet'],
  },
  {
    judul: 'Semarang Dunk Arena',
    alamat: 'Semarang Selatan, Semarang',
    tipe: 'Indoor',
    harga: 175000,
    rating: 4.4,
    gambar: '/images/lapangan/3.jpg',
    deskripsi:
      'Arena indoor dengan ring standar kompetisi dan pencahayaan merata, sering dipakai untuk sparing antar sekolah dan komunitas.',
    fasilitas: ['Ring Standar Kompetisi', 'Tribun Penonton', 'Ruang Ganti & Locker', 'Parkir Motor & Mobil'],
  },
  {
    judul: 'Makassar Fastbreak Court',
    alamat: 'Panakkukang, Makassar',
    tipe: 'Outdoor',
    harga: 160000,
    rating: 4.3,
    gambar: '/images/lapangan/4.jpg',
    deskripsi:
      'Lapangan outdoor dengan lampu sorot LED untuk bermain malam. Tersedia area duduk dan kantin untuk menunggu giliran main.',
    fasilitas: ['Lampu Sorot LED', 'Area Duduk', 'Kantin', 'Parkir Luas'],
  },
]

// Foto testimoni: salin dari app/assets/images/pofil (n).jpg ke public/images/profil
const testimoniData = [
  {
    namaUser: 'Andi Pratama',
    testimo: 'Proses booking sangat cepat! Saya tidak perlu lagi chat satu per satu admin lapangan untuk tanya jadwal kosong.',
    rating: 5,
    profil: '/images/profil/1.jpg',
  },
  {
    namaUser: 'Siska Wijaya',
    testimo: 'Fitur pembayaran online-nya memudahkan kami sebagai komunitas. Langsung beres dan tinggal main!',
    rating: 5,
    profil: '/images/profil/2.jpg',
  },
  {
    namaUser: 'Budi Santoso',
    testimo: 'Aplikasi paling informatif untuk cari lapangan Basket di Jakarta. Rating-nya jujur dan fotonya akurat',
    rating: 5,
    profil: '/images/profil/3.jpg',
  },
].map((t, i) => ({ ...t, urutan: i + 1 }))

const faqData = [
  {
    pertanyaan: 'Bagaimana cara melakukan booking lapangan?',
    jawaban:
      'Cukup pilih lapangan basket yang Anda inginkan, tentukan tanggal dan jam tayang, pilih metode pembayaran, dan selesaikan transaksi. Setelah berhasil, Anda akan menerima kode booking melalui email dan aplikasi.',
  },
  {
    pertanyaan: 'Metode pembayaran apa saja yang tersedia?',
    jawaban:
      'Kami mendukung berbagai metode pembayaran mulai dari Virtual Account (BCA, Mandiri, BNI), E-Wallet (GoPay, OVO, DANA), hingga kartu kredit.',
  },
  {
    pertanyaan: 'Apakah saya bisa membatalkan jadwal booking?',
    jawaban:
      'Ya, pembatalan dapat dilakukan minimal 24 jam sebelum jadwal pertandingan dimulai. Dana akan dikembalikan ke saldo akun HoopSpot atau rekening asal sesuai dengan kebijakan pengelola lapangan.',
  },
  {
    pertanyaan: 'Berapa jam operasional layanan HoopSpot?',
    jawaban:
      'Platform website dan sistem booking online kami dapat diakses 24/7. Untuk jam operasional fisik masing-masing lapangan basket bervariasi, namun umumnya buka mulai pukul 06:00 hingga 23:00 WIB.',
  },
].map((f, i) => ({ ...f, urutan: i + 1 }))

// ------------------------------------------------------------------
// 2. Proses seed
// ------------------------------------------------------------------

// Tanggal 'YYYY-MM-DD' yang digeser n hari dari hari ini (WIB)
function tanggalGeser(n) {
  const d = new Date(Date.now() + 7 * 60 * 60 * 1000 + n * 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 10)
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Terhubung ke database:', mongoose.connection.name)

  // Kosongkan dulu supaya seed bisa dijalankan berulang kali
  await Promise.all([
    User.deleteMany({}),
    Lapangan.deleteMany({}),
    Booking.deleteMany({}),
    Favorit.deleteMany({}),
    Testimoni.deleteMany({}),
    Faq.deleteMany({}),
  ])

  // ---- user (password di-hash dulu) ----
  const passwordUser = await bcrypt.hash('Password123', 10)
  const passwordAdmin = await bcrypt.hash('Admin12345', 10)

  const users = await User.create([
    { nama: 'Admin HoopSpot', email: 'admin@hoopspot.com', tel: '081200000000', password: passwordAdmin, role: 'admin', lokasi: 'Medan' },
    { nama: 'Djoko', email: 'djoko@example.com', tel: '081234567890', password: passwordUser, lokasi: 'aceh, Banda Aceh' },
    { nama: 'Andi Pratama', email: 'andi@example.com', tel: '081234567801', password: passwordUser, lokasi: 'Jakarta' },
    { nama: 'Siska Wijaya', email: 'siska@example.com', tel: '081234567802', password: passwordUser, lokasi: 'Bandung' },
    { nama: 'Budi Santoso', email: 'budi@example.com', tel: '081234567803', password: passwordUser, lokasi: 'Surabaya' },
    { nama: 'John Doe', email: 'john@example.com', tel: '081234567804', password: passwordUser, lokasi: 'Bali' },
  ])
  const lapangan = await Lapangan.create(lapanganData)
  await Testimoni.create(testimoniData)
  await Faq.create(faqData)

  // ---- booking ----
  // [selisih hari dari hari ini, index lapangan, index user, slot, durasi (menit), status]
  // Index user: 0 admin, 1 Rahmad, 2 Andi, 3 Siska, 4 Budi, 5 John
  const rencana = [
    [3, 0, 1, '16:00', 120, 'Approved'], // Rahmad - akan datang
    [1, 1, 1, '10:00', 90, 'Pending'], // Rahmad - akan datang, menunggu verifikasi
    [-5, 1, 1, '19:00', 60, 'Approved'], // Rahmad - selesai
    [-10, 2, 1, '13:00', 120, 'Cancelled'], // Rahmad - dibatalkan
    [0, 0, 2, '21:00', 60, 'Approved'],
    [2, 3, 2, '08:00', 90, 'Pending'],
    [4, 2, 3, '13:00', 60, 'Approved'],
    [-3, 3, 3, '16:00', 120, 'Approved'],
    [5, 4, 4, '19:00', 90, 'Pending'],
    [-7, 0, 4, '08:00', 60, 'Approved'],
    [6, 1, 5, '16:00', 120, 'Approved'],
    [7, 5, 2, '10:00', 90, 'Rejected'],
  ]

  const tahun = new Date().getFullYear()
  const bookings = rencana.map(([selisih, iLapangan, iUser, slot, durasi, status], i) => {
    const user = users[iUser]
    return {
      kode: `HPS-${tahun}-${String(i + 1).padStart(3, '0')}`,
      user: user._id,
      lapangan: lapangan[iLapangan]._id,
      tanggal: tanggalGeser(selisih),
      jamMulai: slot,
      durasi,
      nama: user.nama,
      email: user.email,
      metode: i % 2 === 0 ? 'qris' : 'va',
      harga: hitungHarga(lapangan[iLapangan].harga, durasi),
      status,
    }
  })
  await Booking.create(bookings)

  // ---- favorit ----
  await Favorit.create([
    { user: users[1]._id, lapangan: lapangan[0]._id },
    { user: users[1]._id, lapangan: lapangan[1]._id },
    { user: users[1]._id, lapangan: lapangan[4]._id },
    { user: users[2]._id, lapangan: lapangan[3]._id },
  ])

  console.log('\nSeed selesai:')
  console.log(`  users     : ${users.length}`)
  console.log(`  lapangan  : ${lapangan.length}`)
  console.log(`  bookings  : ${bookings.length}`)
  console.log('  favorit, testimoni, faq: terisi')
  console.log('\nAkun dummy:')
  console.log('  Admin : admin@hoopspot.com  / Admin12345')
  console.log('  User  : djoko@example.com  / Password123')
  console.log('          (juga andi@, siska@, budi@, john@example.com)')
}

seed()
  .catch((error) => {
    console.error('Seed gagal:', error.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())
