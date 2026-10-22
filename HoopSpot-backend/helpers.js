// Fungsi-fungsi kecil yang dipakai di banyak file

// Samakan dengan app/data/booking.ts di frontend
const SLOTS = ['08:00', '10:00', '13:00', '16:00', '19:00', '21:00']
const DURASI = [60, 90, 120] // menit
const METODE = ['qris', 'va', 'transfer', 'tunai']
const BIAYA_LAYANAN = 5000
const STATUS_AKTIF = ['Pending', 'Approved'] // status yang "memakai" slot

// Harga lapangan itu PER JAM. Contoh: 300.000 x 90 menit = 450.000
function hitungHarga(hargaPerJam, durasiMenit) {
  const sewa = Math.round((hargaPerJam * durasiMenit) / 60)
  return { sewa, layanan: BIAYA_LAYANAN, total: sewa + BIAYA_LAYANAN }
}

// '16:00' + 120 menit = '18:00'
function hitungJamSelesai(slot, durasiMenit) {
  const [jam, menit] = slot.split(':').map(Number)
  const total = jam * 60 + menit + durasiMenit
  const hh = String(Math.floor(total / 60)).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')
  return `${hh}:${mm}`
}

// Waktu mulai booking sebagai objek Date. Semua jam dianggap WIB (+07:00).
function waktuMulai(tanggal, slot) {
  return new Date(`${tanggal}T${slot}:00+07:00`)
}

// Tanggal harus berformat YYYY-MM-DD dan benar-benar ada di kalender
function tanggalValid(tanggal) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal || '')) return false
  // 2026-02-31 akan "dibulatkan" JavaScript jadi 2026-03-03, jadi hasilnya kita bandingkan lagi
  const d = new Date(`${tanggal}T00:00:00Z`)
  return !isNaN(d) && d.toISOString().slice(0, 10) === tanggal
}

// Waktu sekarang di WIB: tanggal 'YYYY-MM-DD' dan jam dalam menit sejak 00:00
function sekarangWIB() {
  const wib = new Date(Date.now() + 7 * 60 * 60 * 1000) // geser +7 jam, lalu baca sebagai UTC
  return {
    tanggal: wib.toISOString().slice(0, 10),
    menit: wib.getUTCHours() * 60 + wib.getUTCMinutes(),
  }
}

function emailValid(email) {
  return /^\S+@\S+\.\S+$/.test(email || '')
}

// Bentuk data user yang dikirim ke frontend (tanpa password)
function dataUser(user) {
  return { id: String(user._id), nama: user.nama, email: user.email, tel: user.tel, role: user.role }
}

// Bentuk data booking untuk halaman konfirmasi. `lapangan` harus sudah di-populate.
function dataBooking(b) {
  const l = b.lapangan
  return {
    id: String(b._id),
    kode: b.kode,
    lapangan: { id: String(l._id), judul: l.judul, alamat: l.alamat, gambar: l.gambar },
    tanggal: b.tanggal,
    slot: b.jamMulai,
    jamSelesai: hitungJamSelesai(b.jamMulai, b.durasi),
    durasi: b.durasi,
    metode: b.metode,
    nama: b.nama,
    email: b.email,
    harga: b.harga,
    status: b.status,
  }
}

module.exports = {
  SLOTS,
  DURASI,
  METODE,
  STATUS_AKTIF,
  hitungHarga,
  hitungJamSelesai,
  waktuMulai,
  tanggalValid,
  sekarangWIB,
  emailValid,
  dataUser,
  dataBooking,
}
