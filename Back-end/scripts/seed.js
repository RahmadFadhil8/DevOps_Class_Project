/**
 * Mengisi database dengan dummy data HoopSpot.
 *
 *   npm run seed
 *
 * PERHATIAN: semua data di collection users, lapangan, bookings, testimoni, faq
 * dan counters akan DIHAPUS lalu diisi ulang. Aman dijalankan berulang kali.
 */
import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import { User } from '../src/models/User.js'
import { Lapangan } from '../src/models/Lapangan.js'
import { Booking } from '../src/models/Booking.js'
import { Testimoni } from '../src/models/Testimoni.js'
import { Faq } from '../src/models/Faq.js'
import { Counter } from '../src/models/Counter.js'
import { BOOKING_STATUS, PAYMENT_STATUS, ROLE } from '../src/config/constants.js'
import { addDays, toDate, toHHmm, toMinutes, todayWIB } from '../src/utils/time.js'
import { buatKodeBooking, hitungBiaya } from '../src/services/booking.service.js'

if (env.isProd && !process.argv.includes('--force')) {
  console.error('Seed ditolak karena NODE_ENV=production (akan menghapus data). Tambahkan --force jika yakin.')
  process.exit(1)
}

/* ------------------------------ Data ------------------------------ */

const PASSWORD_USER = 'Password123'
const PASSWORD_ADMIN = 'Admin12345'

const usersData = [
  { nama: 'Admin HoopSpot', email: 'admin@hoopspot.com', tel: '081200000000', password: PASSWORD_ADMIN, role: ROLE.ADMIN },
  { nama: 'Andi Pratama', email: 'andi@example.com', tel: '081234567801', password: PASSWORD_USER },
  { nama: 'Siska Wijaya', email: 'siska@example.com', tel: '081234567802', password: PASSWORD_USER },
  { nama: 'Budi Santoso', email: 'budi@example.com', tel: '081234567803', password: PASSWORD_USER },
  { nama: 'John Doe', email: 'john@example.com', tel: '081234567804', password: PASSWORD_USER },
  { nama: 'Rina Marlina', email: 'rina@example.com', tel: '081234567805', password: PASSWORD_USER },
]

// 4 lapangan pertama diambil dari app/data/lapangan.ts. Sisanya tambahan supaya filter/pencarian terasa.
// Gambar: salin app/assets/images/1.jpg..4.jpg ke public/images/lapangan/ (lihat README).
const lapanganData = [
  {
    judul: 'Bali Basketball Club',
    alamat: 'Canggu, Bali',
    tipe: 'Outdoor',
    harga: 300000,
    rating: 5.0,
    jumlahReview: 214,
    gambar: '/images/lapangan/1.jpg',
    deskripsi:
      'Bali Basketball Club menawarkan pengalaman bermain basket outdoor & indoor premium di kawasan Canggu. Dengan lantai kayu (parquet) berkualitas internasional dan atmosfer tropis yang nyaman, tempat ini menjadi favorit komunitas basket lokal maupun wisatawan.',
    fasilitas: ['Parkir Luas', 'Ruang Ganti & Locker', 'Shower Air Panas', 'Sewa Bola & Ring Tinggi Standar FIBA', 'Kafe & Lounge'],
    jamBuka: '07:00',
    jamTutup: '22:00',
  },
  {
    judul: 'Hoop Arena Jakarta',
    alamat: 'Jakarta Selatan',
    tipe: 'Indoor',
    harga: 250000,
    rating: 4.9,
    jumlahReview: 187,
    gambar: '/images/lapangan/2.jpg',
    deskripsi:
      'Hoop Arena Jakarta hadir dengan fasilitas arena basket indoor modern ber-AC di pusat kota. Sangat cocok untuk latihan rutin, sparing komunitas 3x3 maupun 5v5, hingga event turnamen lokal.',
    fasilitas: ['Lantai Parquet Vynil Premium', 'Scoreboard Digital', 'Tribun Penonton', 'Musala', 'Area Food Court'],
    jamBuka: '06:00',
    jamTutup: '23:00',
  },
  {
    judul: 'Court Side Basketball',
    alamat: 'Bandung',
    tipe: 'Indoor',
    harga: 220000,
    rating: 4.8,
    jumlahReview: 143,
    gambar: '/images/lapangan/3.jpg',
    deskripsi:
      'Court Side Basketball menghadirkan lapangan basket berstandar dengan udara sejuk khas Bandung. Tempat ini dirancang ideal bagi pemain pemula hingga profesional yang ingin mengasah skill dribble dan shooting.',
    fasilitas: ['Ring Basket Adjustable', 'Penyewaan Bola & Rompi Tim', 'Ruang Istirahat Player', 'Kantin & Vending Machine', 'Toilet & Ruang Ganti Bersih'],
    jamBuka: '07:00',
    jamTutup: '22:00',
  },
  {
    judul: 'Surabaya Basketball Hub',
    alamat: 'Surabaya',
    tipe: 'Indoor',
    harga: 200000,
    rating: 4.7,
    jumlahReview: 121,
    gambar: '/images/lapangan/4.jpg',
    deskripsi:
      'Surabaya Basketball Hub merupakan pusat olahraga modern di Surabaya yang menyediakan lapangan basket indoor serbaguna dengan penerangan pencahayaan LED yang terang dan nyaman untuk main malam.',
    fasilitas: ['Area Parkir Mobil & Motor Luas', 'WiFi Gratis 100 Mbps', 'Penyewaan Lapangan 3x3 & Full Court', 'Tribun Penonton Mini'],
    jamBuka: '07:00',
    jamTutup: '22:00',
  },
  {
    judul: 'Medan Hoops Center',
    alamat: 'Medan Johor, Medan',
    tipe: 'Indoor',
    harga: 180000,
    rating: 4.6,
    jumlahReview: 76,
    gambar: '/images/lapangan/1.jpg',
    deskripsi:
      'Medan Hoops Center adalah lapangan basket indoor ber-AC dengan lantai vinyl anti selip. Favorit komunitas basket kampus dan kantor di Medan untuk latihan rutin sore hari.',
    fasilitas: ['Parkir Luas', 'Ruang Ganti', 'Kantin', 'Musala'],
    jamBuka: '07:00',
    jamTutup: '22:00',
  },
  {
    judul: 'Jogja Slam Court',
    alamat: 'Sleman, Yogyakarta',
    tipe: 'Outdoor',
    harga: 150000,
    rating: 4.5,
    jumlahReview: 64,
    gambar: '/images/lapangan/2.jpg',
    deskripsi:
      'Lapangan outdoor beratap dengan permukaan semen yang diaplikasi coating akrilik. Cocok untuk 3x3 santai bersama teman dengan suasana khas Yogyakarta.',
    fasilitas: ['Atap Pelindung Hujan', 'Penyewaan Bola', 'Warung Minuman', 'Toilet'],
    jamBuka: '07:00',
    jamTutup: '21:00',
  },
  {
    judul: 'Semarang Dunk Arena',
    alamat: 'Semarang Selatan, Semarang',
    tipe: 'Indoor',
    harga: 175000,
    rating: 4.4,
    jumlahReview: 52,
    gambar: '/images/lapangan/3.jpg',
    deskripsi:
      'Arena indoor dengan ring standar kompetisi dan pencahayaan merata, sering dipakai untuk sparing antar sekolah dan komunitas.',
    fasilitas: ['Ring Standar Kompetisi', 'Tribun Penonton', 'Ruang Ganti & Locker', 'Parkir Motor & Mobil'],
    jamBuka: '07:00',
    jamTutup: '22:00',
  },
  {
    judul: 'Makassar Fastbreak Court',
    alamat: 'Panakkukang, Makassar',
    tipe: 'Outdoor',
    harga: 160000,
    rating: 4.3,
    jumlahReview: 41,
    gambar: '/images/lapangan/4.jpg',
    deskripsi:
      'Lapangan outdoor dengan lampu sorot LED untuk bermain malam. Tersedia area duduk dan kantin untuk menunggu giliran main.',
    fasilitas: ['Lampu Sorot LED', 'Area Duduk', 'Kantin', 'Parkir Luas'],
    jamBuka: '08:00',
    jamTutup: '22:00',
  },
]

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

// [selisih hari dari hari ini, index lapangan, index user, jam mulai, durasi menit, status]
// Index user: 0 = admin, jadi user biasa mulai dari 1. Tidak ada jadwal yang saling bentrok.
const { PENDING, APPROVED, REJECTED, CANCELLED } = BOOKING_STATUS
const rencanaBooking = [
  [-10, 0, 1, '07:00', 90, APPROVED],
  [-9, 1, 2, '10:00', 120, APPROVED],
  [-7, 2, 3, '15:00', 60, APPROVED],
  [-5, 3, 4, '16:30', 90, APPROVED],
  [-3, 1, 1, '08:30', 90, APPROVED],
  [-2, 0, 2, '11:30', 90, CANCELLED],
  [-1, 2, 3, '16:30', 90, REJECTED],
  [0, 1, 4, '15:00', 90, APPROVED],
  [0, 0, 1, '16:30', 60, PENDING],
  [1, 1, 2, '10:00', 90, APPROVED],
  [2, 2, 3, '07:00', 120, APPROVED],
  [3, 3, 4, '08:30', 90, PENDING],
  [4, 4, 5, '10:00', 90, APPROVED],
  [5, 0, 1, '15:00', 90, APPROVED],
  [7, 1, 2, '16:30', 60, PENDING],
]

/* ------------------------------ Proses ------------------------------ */

async function seed() {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 })
  console.log(`Terhubung ke database "${mongoose.connection.name}"`)

  // Pastikan collection + index terbentuk, lalu kosongkan isinya
  const models = [User, Lapangan, Booking, Testimoni, Faq, Counter]
  await Promise.all(models.map((m) => m.init()))
  await Promise.all(models.map((m) => m.deleteMany({})))

  // User.create (bukan insertMany) agar hook hash password berjalan
  const users = await User.create(usersData)
  const courts = await Lapangan.create(lapanganData)
  await Testimoni.create(testimoniData)
  await Faq.create(faqData)

  const hariIni = todayWIB()
  const bookings = []

  for (const [selisih, iCourt, iUser, jamMulai, durasi, status] of rencanaBooking) {
    const court = courts[iCourt]
    const user = users[iUser]
    const tanggal = addDays(hariIni, selisih)
    const paid = status === APPROVED
    const refunded = status === CANCELLED || status === REJECTED

    bookings.push({
      kodeBooking: await buatKodeBooking(),
      user: user._id,
      lapangan: court._id,
      tanggal,
      jamMulai,
      jamSelesai: toHHmm(toMinutes(jamMulai) + durasi),
      durasi,
      mulaiAt: toDate(tanggal, jamMulai),
      kontak: { nama: user.nama, email: user.email },
      biaya: hitungBiaya(court.harga, durasi),
      status,
      pembayaran: {
        metode: 'QRIS',
        status: paid ? PAYMENT_STATUS.PAID : refunded ? PAYMENT_STATUS.REFUNDED : PAYMENT_STATUS.UNPAID,
        dibayarAt: paid || refunded ? toDate(addDays(tanggal, -2), '09:00') : undefined,
      },
      // Pending demo diberi batas bayar 1 hari supaya tidak langsung kedaluwarsa & hilang dari dashboard
      expiresAt: status === PENDING ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined,
      alasan:
        status === REJECTED ? 'Lapangan sedang dalam perawatan' : status === CANCELLED ? 'Berhalangan hadir' : undefined,
    })
  }
  await Booking.insertMany(bookings)

  console.log('\n✔ Seed selesai')
  console.log(`  users      : ${users.length}`)
  console.log(`  lapangan   : ${courts.length}`)
  console.log(`  bookings   : ${bookings.length}`)
  console.log(`  testimoni  : ${testimoniData.length}`)
  console.log(`  faq        : ${faqData.length}`)
  console.log('\nAkun dummy (khusus development):')
  console.log(`  Admin : admin@hoopspot.com / ${PASSWORD_ADMIN}`)
  console.log(`  User  : andi@example.com   / ${PASSWORD_USER}   (juga siska@, budi@, john@, rina@example.com)`)
}

seed()
  .catch((err) => {
    console.error('\n✖ Seed gagal:', err.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())
