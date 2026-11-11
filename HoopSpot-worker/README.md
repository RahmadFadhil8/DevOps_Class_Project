# HoopSpot Auto-Cancellation Booking Worker

Worker service yang berjalan di latar belakang (background worker) dalam kontainer terpisah untuk membatalkan pesanan booking lapangan secara otomatis apabila pembayaran tidak diselesaikan sebelum batas waktu berakhir.

## Fitur & Cara Kerja
1. Memantau dokumen `Booking` pada MongoDB dengan status `Menunggu Pembayaran`.
2. Secara berkala (default tiap 1000 ms) memeriksa apakah `batasPembayaran` telah melewati waktu sekarang (`now`).
3. Jika waktu batas pembayaran habis dan pemesan belum menekan tombol "Saya sudah bayar":
   - Worker mengubah status booking menjadi `Cancelled`.
   - Waktu slot booking yang awalnya dipesan otomatis terbuka kembali (karena `Cancelled` tidak termasuk dalam `STATUS_AKTIF`).
4. Menyediakan logging real-time yang informatif di kontainer Docker.

## Variabel Lingkungan
- `MONGODB_URI`: URI koneksi MongoDB (default: `mongodb://mongodb:27017/hoopspot`).
- `CHECK_INTERVAL_MS`: Interval polling pengecekan dalam milidetik (default: `1000`).
