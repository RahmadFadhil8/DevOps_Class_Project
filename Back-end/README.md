# HoopSpot Backend

REST API untuk HoopSpot: **Express 5 + MongoDB (Mongoose)**. Letakkan folder ini di root project, sejajar dengan `app/`:

```
HoopSpot/
├─ app/            ← frontend Nuxt
├─ backend/        ← folder ini
└─ nuxt.config.ts
```

## 1. Persiapan

- Node.js 20+
- **MongoDB Community Server 6.0+** (wajib 6.0+ karena index anti double-booking) dan **MongoDB Compass**
- Pastikan MongoDB berjalan, lalu di Compass buat koneksi ke `mongodb://127.0.0.1:27017`

## 2. Menjalankan

```bash
cd backend
npm install
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
```

Edit `.env`, isi `JWT_SECRET` dengan string acak:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Isi dummy data lalu jalankan server:

```bash
npm run seed     # mengisi database "hoopspot" (hapus & isi ulang, aman diulang)
npm run dev      # API di http://localhost:4000/api
```

Di Compass klik **Refresh** pada koneksi, database `hoopspot` akan muncul berisi collection
`users`, `lapangan`, `bookings`, `testimoni`, `faq`, `counters`.

**Akun dummy** (hanya untuk development):

| Role  | Email               | Password     |
|-------|---------------------|--------------|
| Admin | admin@hoopspot.com  | Admin12345   |
| User  | andi@example.com    | Password123  |

User lain: siska@, budi@, john@, rina@example.com (password sama).

## 3. Menghubungkan ke Nuxt

Ganti `nuxt.config.ts` dengan versi yang disertakan (menambahkan `routeRules` proxy). Setelah itu
semua `$fetch('/api/...')` di frontend otomatis diteruskan ke Express, tanpa urusan CORS.
`authService.register` yang sudah ada langsung bekerja.

Gambar: backend hanya menyimpan path. Salin gambar ke folder `public` Nuxt (PowerShell, dari root HoopSpot):

```powershell
mkdir public/images/lapangan, public/images/profil
1..4 | % { Copy-Item "app/assets/images/$_.jpg" "public/images/lapangan/$_.jpg" }
1..3 | % { Copy-Item "app/assets/images/pofil ($_).jpg" "public/images/profil/$_.jpg" }
```

Contoh mengganti data statis di `lapangan/index.vue`:

```ts
const { data: Data } = await useFetch<Lapangan[]>('/api/lapangan')
```

Penyesuaian kecil di frontend:
- `Lapangan.id` sekarang **string** (ObjectId). Di `lapangan/[id].vue` hapus `Number(...)` pada `useRoute().params.id`.
- `Lapangan.rating` berupa angka (tampilkan dengan `.toFixed(1)`).
- Opsi "Rentang Harga" di `tablefilter.vue` masih berisi Pending/Approved/Rejected (salin tempel). Kirim ke API sebagai `hargaMin` / `hargaMax`.
- Untuk endpoint yang butuh login, kirim header `Authorization: Bearer <token>`.

## 4. Endpoint

Error selalu berbentuk `{ "message": "..." }`, jadi `error.data.message` langsung bisa ditampilkan.

| Method | Path | Akses | Keterangan |
|---|---|---|---|
| POST | `/api/auth/register` | publik | body `{nama,email,tel,password}` → `{user,token}` |
| POST | `/api/auth/login` | publik | body `{email,password}` → `{user,token}` |
| GET | `/api/auth/me` | login | profil |
| GET | `/api/lapangan` | publik | query: `q`, `tipe` (Indoor/Outdoor), `hargaMin`, `hargaMax`, `sort` (rating, harga-asc, harga-desc, terbaru) |
| GET | `/api/lapangan/:id` | publik | detail |
| GET | `/api/lapangan/:id/availability?tanggal=YYYY-MM-DD&durasi=90` | publik | daftar slot + `tersedia` |
| POST | `/api/booking` | login | body `{lapanganId,tanggal,jamMulai,durasi,kontak?,metode?}` |
| GET | `/api/booking/saya` | login | riwayat booking (opsional `?status=`) |
| GET | `/api/booking/:id` | pemilik/admin | detail (halaman konfirmasi) |
| POST | `/api/booking/:id/bayar` | pemilik | **simulasi** bayar QRIS |
| PATCH | `/api/booking/:id/batal` | pemilik | batal |
| GET | `/api/testimoni`, `/api/faq` | publik | konten landing page |
| GET | `/api/admin/stats` | admin | 4 kartu statistik dashboard |
| GET | `/api/admin/booking` | admin | `?status=&tanggal=&limit=` |
| PATCH | `/api/admin/booking/:id/status` | admin | `{status: "Approved" atau "Rejected"}` |
| GET | `/api/admin/lapangan/status` | admin | kartu "Court Status" |
| POST/PATCH/DELETE | `/api/admin/lapangan[/:id]` | admin | kelola lapangan (DELETE = sembunyikan) |

## 5. Aturan bisnis

- **Harga per jam**: sewa = `harga × durasi / 60`, ditambah biaya layanan Rp 5.000 (sesuai halaman pembayaran).
- Jam mulai harus salah satu slot `07:00, 08:30, 10:00, 11:30, 15:00, 16:30` dan durasi 60/90/120 menit (sama dengan `app/data/booking.ts`). Ubah di `src/config/constants.js`.
- Booking baru berstatus **Pending** dan menahan slot **15 menit**. Jika tidak dibayar → `Expired` dan slot kosong lagi. Setelah `/bayar` → `Approved` + `Paid`.
- Jadwal yang bentrok ditolak (409). Ada unique index sebagai pengaman bila dua request masuk bersamaan.
- Batal: bebas saat Pending; saat sudah Approved minimal **24 jam** sebelum main (sesuai FAQ). Yang sudah dibayar ditandai `Refunded` (pengembalian dana belum otomatis).
- Semua jam dianggap **WIB**. Tanggal disimpan sebagai teks `YYYY-MM-DD`.

## 6. Catatan

- `/bayar` hanya simulasi. Untuk produksi, sambungkan Midtrans/Xendit dan pindahkan logikanya ke webhook.
- Booking maksimal 60 hari ke depan; filter tanggal di daftar lapangan belum ada (pakai endpoint `availability`).
- Sebelum deploy: ganti `JWT_SECRET`, set `CLIENT_URL`, `NODE_ENV=production`, dan jangan jalankan `npm run seed`.
