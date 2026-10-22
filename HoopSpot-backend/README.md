# HoopSpot Backend

Back-end sederhana untuk web booking lapangan basket HoopSpot.
**Express + MongoDB (Mongoose)**, cocok untuk **MongoDB 5.0.9** dan **MongoDB Compass**.

Project ini terpisah dari frontend Nuxt:

```
Projects/
├─ HoopSpot/            ← frontend Nuxt
└─ HoopSpot-backend/    ← folder ini
```

## 1. Menjalankan

Syarat: Node.js 18+ dan MongoDB sudah berjalan (Compass bisa connect ke `mongodb://127.0.0.1:27017`).

```bash
cd HoopSpot-backend
npm install
cp .env.example .env      # Windows PowerShell: Copy-Item .env.example .env
npm run seed              # isi database dengan dummy data
npm run dev               # server jalan di http://localhost:4000
```

Buka MongoDB Compass, klik **Refresh**, akan muncul database `hoopspot` berisi collection
`users`, `lapangan`, `bookings`, `favorit`, `testimoni`, `faq`.

Cek server: buka http://localhost:4000/api/health di browser.

**Akun dummy:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@hoopspot.com | Admin12345 |
| User | rahmad@example.com | Password123 |

User lain: andi@, siska@, budi@, john@example.com (password sama dengan user).

`npm run seed` menghapus lalu mengisi ulang semua data, jadi aman diulang kapan saja.

## 2. Struktur folder

```
server.js        ← titik masuk: koneksi MongoDB + daftar route
seed.js          ← dummy data
helpers.js       ← hitung harga, jam selesai, validasi tanggal, dll.
models/          ← bentuk data di MongoDB (User, Lapangan, Booking, Favorit, Testimoni, Faq)
routes/          ← endpoint API, satu file per fitur
middleware/auth.js  ← cek login (token) dan cek admin
```

## 3. Menghubungkan ke frontend

**a. Proxy.** Ganti `nuxt.config.ts` di project Nuxt dengan file yang disertakan (hanya menambah `routeRules`).
Jalankan backend dan Nuxt bersamaan di dua terminal.

**b. Gambar.** Database hanya menyimpan path gambar. Salin gambar ke folder `public` di project Nuxt
(PowerShell, dari root project Nuxt):

```powershell
mkdir public/images/lapangan, public/images/profil
1..4 | % { Copy-Item "app/assets/images/$_.jpg" "public/images/lapangan/$_.jpg" }
1..3 | % { Copy-Item "app/assets/images/pofil ($_).jpg" "public/images/profil/$_.jpg" }
```

**c. Token login.** Saat login, server mengirim `token`. Simpan token itu, lalu kirim di header
`Authorization` untuk endpoint yang butuh login. Di `useAuth.ts`, setelah `authService.login`:

```ts
const token = useCookie<string | null>('token', { maxAge: 60 * 60 * 24 * 7 })
token.value = response.token ?? null
```

Buat `app/composables/useApi.ts` (dipakai untuk semua request yang butuh login):

```ts
export const useApi = () => {
  const token = useCookie<string | null>('token')
  return $fetch.create({
    headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
  })
}
```

Contoh pemakaian di halaman pembayaran (`submitPayment`):

```ts
const api = useApi()
const booking = await api<{ id: string }>('/api/booking', {
  method: 'POST',
  body: {
    lapanganId: String(Data.id), tanggal: tanggal.value, slot: slot.value,
    durasi: durasi.value, nama: nama.value, email: email.value, metode: paymentMethod.value,
  },
})
await navigateTo({ path: '/konfirmasi', query: { id: booking.id } })
```

**d. Penyesuaian type.** `id` lapangan dari MongoDB berupa **string**, jadi di `types/index.ts` ubah
`id: number` menjadi `id: string` dan `rating: string` menjadi `rating: number`; di `lapangan/[id].vue`
hapus `Number(...)` pada `route.params.id`. Opsi "Rentang Harga" di `tablefilter.vue` masih berisi
Pending/Approved/Rejected; kirim ke API sebagai `hargaMin` dan `hargaMax`.

**Halaman → endpoint:**

| Halaman | Endpoint |
|---|---|
| Register, Login | `POST /api/auth/register`, `POST /api/auth/login` |
| Daftar lapangan + filter | `GET /api/lapangan` |
| Detail lapangan | `GET /api/lapangan/:id` dan `GET /api/lapangan/:id/availability?tanggal=` |
| Pembayaran → Konfirmasi | `POST /api/booking`, lalu `GET /api/booking/:id` |
| Profile | `GET /api/profile`, `PUT /api/profile` |
| Pengaturan (ganti password) | `PUT /api/profile/password` |
| Riwayat booking | `GET /api/profile/booking` |
| Favorit | `GET /api/favorit`, `DELETE /api/favorit/:lapanganId` |
| Landing page | `GET /api/testimoni`, `GET /api/faq` |
| Dashboard admin | `GET /api/admin/stats`, `GET /api/admin/booking`, `GET /api/admin/lapangan/status` |

## 4. Daftar endpoint

Error selalu berbentuk `{ "message": "..." }`. Tanda 🔒 = wajib login.

| Method | Path | Keterangan |
|---|---|---|
| POST | `/api/auth/register` | body `{nama, email, tel, password}` |
| POST | `/api/auth/login` | body `{email, password}` → `{message, user, token}` |
| GET | `/api/auth/me` 🔒 | data user yang login |
| GET | `/api/lapangan` | query opsional: `q`, `tipe`, `hargaMin`, `hargaMax` |
| GET | `/api/lapangan/:id` | detail |
| GET | `/api/lapangan/:id/availability?tanggal=YYYY-MM-DD` | slot jam yang masih kosong |
| POST | `/api/booking` 🔒 | body `{lapanganId, tanggal, slot, durasi, nama, email, metode}` |
| GET | `/api/booking/:id` 🔒 | detail booking |
| PATCH | `/api/booking/:id/batal` 🔒 | batalkan (minimal 24 jam sebelum main) |
| GET | `/api/profile` 🔒 | data profil |
| PUT | `/api/profile` 🔒 | body `{nama, email, telepon, lokasi}` |
| PUT | `/api/profile/password` 🔒 | body `{passwordLama, passwordBaru}` |
| GET | `/api/profile/booking` 🔒 | riwayat booking milik sendiri |
| GET | `/api/favorit` 🔒 | daftar favorit |
| POST / DELETE | `/api/favorit/:lapanganId` 🔒 | tambah / hapus favorit |
| GET | `/api/testimoni`, `/api/faq` | konten landing page |
| GET | `/api/admin/stats` 🔒 admin | 4 kartu statistik |
| GET | `/api/admin/booking?status=Pending` 🔒 admin | tabel booking |
| PATCH | `/api/admin/booking/:id` 🔒 admin | body `{status: "Approved"}` atau `"Rejected"` |
| GET | `/api/admin/lapangan/status` 🔒 admin | status lapangan hari ini |

## 5. Aturan yang dipakai

- Harga lapangan **per jam**: sewa = harga × durasi ÷ 60, ditambah biaya layanan Rp 5.000.
- Slot jam: `08:00, 10:00, 13:00, 16:00, 19:00, 21:00`, durasi 60/90/120 menit (sama dengan `data/booking.ts`).
  Kalau frontend mengubah daftar ini, ubah juga di `helpers.js`.
- Booking baru berstatus **Pending** ("Menunggu verifikasi"), lalu admin mengubahnya jadi **Approved** atau **Rejected**.
  Slot yang Pending/Approved tidak bisa dipesan orang lain.
- Di halaman profile, status diubah otomatis menjadi `upcoming` / `completed` / `cancelled` (lihat `statusProfile` di `routes/profile.js`).
- Semua jam dianggap WIB. Pembayaran belum memakai payment gateway (hanya mencatat metode yang dipilih).
