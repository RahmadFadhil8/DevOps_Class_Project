<template>
  <main class="min-h-screen bg-gray-50 px-4 py-12 pt-24 sm:px-6">
    <section class="mx-auto flex w-full max-w-3xl justify-center">
      <UiCard class="w-full p-5 sm:p-8 md:p-10">
        <div v-if="!booking" class="text-center py-12">
          <p class="text-gray-500">Memuat detail booking...</p>
        </div>

        <!-- ============================================================== -->
        <!-- STATUS 1: MENUNGGU PEMBAYARAN (Timer 10 Detik + Tombol Bayar) -->
        <!-- ============================================================== -->
        <div v-else-if="booking.status === 'Menunggu Pembayaran'" class="flex flex-col items-center gap-5">
          <!-- Icon Menunggu Pembayaran -->
          <div class="relative flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 sm:h-24 sm:w-24">
            <span class="text-3xl sm:text-4xl">⏱️</span>
            <span class="absolute -top-1 -right-1 flex h-4 w-4">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
            </span>
          </div>

          <div class="space-y-2 text-center">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
              Menunggu Pembayaran
            </h1>
            <p class="mx-auto max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              Selesaikan pembayaran sebelum batas waktu berakhir. Jika waktu habis, pesanan akan dibatalkan otomatis oleh worker dan slot dibuka kembali.
            </p>
          </div>

          <p class="text-sm text-gray-500">
            Kode booking: <span class="font-bold text-gray-900">{{ booking.kode }}</span>
          </p>

          <!-- Banner Countdown Timer Batas Pembayaran -->
          <div class="w-full rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-5 sm:p-6 text-center">
            <p class="text-xs font-bold uppercase tracking-wider text-amber-700">
              Sisa Batas Waktu Pembayaran
            </p>

            <div class="mt-2 flex items-center justify-center gap-2">
              <span class="font-mono text-4xl sm:text-5xl font-black text-amber-600 tracking-wider">
                00:{{ formattedSeconds }}
              </span>
            </div>

            <!-- Progress bar timer -->
            <div class="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-amber-200">
              <div
                class="h-full bg-amber-500 transition-all duration-1000 ease-linear rounded-full"
                :style="{ width: `${progressPercentage}%` }"
              />
            </div>

            <p class="mt-3 text-xs text-amber-800">
              ⏳ Harap segera selesaikan pembayaran dalam <strong>{{ remainingSeconds }} detik</strong> ini.
            </p>
          </div>

          <!-- Alert Error jika ada -->
          <div
            v-if="errorMessage"
            class="w-full rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 text-center"
          >
            {{ errorMessage }}
          </div>

          <!-- Informasi Lapangan & Tagihan -->
          <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <UiCard class="p-5">
              <div class="mb-3 flex items-center gap-2">
                <img src="~/assets/icon/tennis.svg" alt="" class="h-6 w-6">
                <p class="text-sm text-gray-500">Lapangan</p>
              </div>
              <p class="font-semibold text-gray-900">{{ namaLapangan }}</p>
              <p class="mt-1 text-xs text-gray-500">{{ booking.lapangan.alamat }}</p>
            </UiCard>

            <UiCard class="p-5">
              <div class="mb-3 flex items-center gap-2">
                <img src="~/assets/icon/calendar.svg" alt="" class="h-6 w-6">
                <p class="text-sm text-gray-500">Jadwal Main</p>
              </div>
              <p class="font-semibold text-gray-900">{{ tanggalFormatted }}</p>
              <p class="mt-1 text-sm text-gray-600">{{ slot || '-' }}–{{ jamSelesai || '-' }} WIB ({{ durasiLabel }})</p>
            </UiCard>

            <!-- Detail Instruksi Pembayaran -->
            <UiCard class="p-5 sm:col-span-2">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p class="text-xs text-gray-500 uppercase font-semibold">Metode Pembayaran</p>
                  <p class="mt-1 font-bold text-gray-900 text-base">{{ metodeLabel }}</p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ booking.metode === 'qris' ? 'Pindai kode QRIS di bawah ini dengan aplikasi e-wallet Anda.' : 'Transfer ke Virtual Account resmi HoopSpot.' }}
                  </p>
                </div>

                <div class="sm:text-right">
                  <p class="text-xs text-gray-500 uppercase font-semibold">Total Tagihan</p>
                  <p class="mt-1 text-2xl font-black text-primary">{{ formatCurrency(booking.harga?.total) }}</p>
                </div>
              </div>

              <!-- Mock QRIS / VA Display -->
              <div v-if="booking.metode === 'qris'" class="mt-4 flex flex-col items-center justify-center rounded-xl bg-gray-50 p-4 border border-dashed border-gray-300">
                <div class="flex h-36 w-36 items-center justify-center rounded-lg bg-white p-2 shadow-sm border border-gray-200">
                  <div class="text-center">
                    <span class="text-5xl font-mono">▦</span>
                    <p class="mt-1 text-[10px] font-bold text-gray-400">QRIS STANDAR</p>
                  </div>
                </div>
                <p class="mt-2 text-xs text-gray-500 font-medium">Scan QRIS untuk menyelesaikan transaksi</p>
              </div>

              <div v-else class="mt-4 rounded-xl bg-gray-50 p-4 border border-dashed border-gray-300">
                <p class="text-xs text-gray-500">Nomor Virtual Account:</p>
                <p class="text-lg font-mono font-bold text-gray-900 tracking-wider">8801 2345 6789 0001</p>
                <p class="mt-1 text-xs text-gray-400">Bank Central Asia (BCA) a.n. HoopSpot Official</p>
              </div>
            </UiCard>
          </div>

          <!-- Tombol Aksi: "Saya sudah bayar" -->
          <div class="mt-3 flex w-full flex-col items-center gap-3">
            <button
              type="button"
              :disabled="isPaying || remainingSeconds <= 0"
              class="w-full sm:w-auto min-w-[240px] rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/25 transition hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              @click="handleSudahBayar"
            >
              <span v-if="isPaying" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              <span>{{ isPaying ? 'Memproses Pembayaran...' : 'Saya sudah bayar' }}</span>
              <span v-if="!isPaying">✓</span>
            </button>

            <p class="text-center text-xs leading-5 text-gray-400">
              Klik tombol di atas untuk menyelesaikan simulasi pembayaran sebelum waktu habis.
            </p>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- STATUS 2: BOOKING BERHASIL (Approved / Lunas)                 -->
        <!-- ============================================================== -->
        <div v-else-if="booking.status === 'Approved' || booking.status === 'Pending'" class="flex flex-col items-center gap-5">
          <!-- Status booking icon -->
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 sm:h-24 sm:w-24">
            <img src="~/assets/icon/check.svg" alt="Booking berhasil" class="h-12 w-12 sm:h-14 sm:w-14">
          </div>

          <div class="space-y-2 text-center">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
              Booking Berhasil!
            </h1>
            <p class="mx-auto max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              Pesanan Anda telah dikonfirmasi dan pembayaran telah berhasil diselesaikan. Siapkan perlengkapan Anda dan sampai jumpa di lapangan!
            </p>
          </div>

          <p class="text-sm text-gray-500">
            Kode booking: <span class="font-bold text-gray-900">{{ booking.kode }}</span>
          </p>

          <UiBadge class="bg-emerald-100 text-emerald-800 font-semibold px-3 py-1">
            ✓ Pembayaran Berhasil & Terkonfirmasi
          </UiBadge>

          <!-- Informasi lapangan -->
          <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <UiCard class="p-5">
              <div class="mb-3 flex items-center gap-2">
                <img src="~/assets/icon/tennis.svg" alt="" class="h-6 w-6">
                <p class="text-sm text-gray-500">Lapangan</p>
              </div>
              <p class="font-semibold text-gray-900">{{ namaLapangan }}</p>
              <p class="mt-1 text-xs text-gray-500">{{ booking.lapangan.alamat }}</p>
            </UiCard>

            <UiCard class="p-5">
              <div class="mb-3 flex items-center gap-2">
                <img src="~/assets/icon/calendar.svg" alt="" class="h-6 w-6">
                <p class="text-sm text-gray-500">Tanggal dan Waktu</p>
              </div>
              <p class="font-semibold text-gray-900">{{ tanggalFormatted }}</p>
              <p class="mt-1 text-sm text-gray-600">{{ slot || '-' }}–{{ jamSelesai || '-' }} WIB</p>
              <p class="mt-1 text-sm text-gray-500">Durasi {{ durasiLabel }}</p>
            </UiCard>

            <!-- Informasi pembayaran -->
            <UiCard class="p-5 sm:col-span-2">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  <img src="~/assets/icon/barcode.svg" alt="" class="h-6 w-6 shrink-0">
                  <div>
                    <p class="font-semibold text-gray-900">{{ metodeLabel }}</p>
                    <p class="mt-1 text-sm leading-5 text-gray-500">
                      Pembayaran telah lunas dikonfirmasi ({{ formatCurrency(booking.harga?.total) }}).
                    </p>
                  </div>
                </div>

                <UiBadge class="bg-emerald-50 text-emerald-700">
                  Lunas
                </UiBadge>
              </div>
            </UiCard>
          </div>

          <!-- Tombol navigasi -->
          <div class="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <UiButton class="w-full sm:w-auto">
              <NuxtLink to="/profile/booking-history" class="block w-full text-center">
                Lihat Tiket Saya
              </NuxtLink>
            </UiButton>

            <UiButton class="w-full sm:w-auto" variant="outline">
              <NuxtLink to="/" class="block w-full text-center">
                Kembali ke Beranda
              </NuxtLink>
            </UiButton>
          </div>

          <p class="text-center text-xs leading-5 text-gray-400">
            Simpan informasi pemesanan ini untuk referensi Anda.
          </p>
        </div>

        <!-- ============================================================== -->
        <!-- STATUS 3: BATAS WAKTU HABIS / DIBATALKAN OTOMATIS OLEH WORKER -->
        <!-- ============================================================== -->
        <div v-else-if="booking.status === 'Cancelled'" class="flex flex-col items-center gap-5">
          <!-- Icon Dibatalkan -->
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 sm:h-24 sm:w-24">
            <span class="text-4xl text-red-600">✕</span>
          </div>

          <div class="space-y-2 text-center">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl text-red-600">
              Batas Waktu Pembayaran Habis
            </h1>
            <p class="mx-auto max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              Pesanan ini telah <strong>dibatalkan secara otomatis oleh background worker</strong> karena melewati batas waktu pembayaran (10 detik).
            </p>
          </div>

          <p class="text-sm text-gray-500">
            Kode booking: <span class="font-bold text-gray-900">{{ booking.kode }}</span>
          </p>

          <UiBadge class="bg-red-100 text-red-700 font-semibold px-3 py-1">
            Status: Dibatalkan Otomatis
          </UiBadge>

          <!-- Kotak Pemberitahuan Slot Terbuka Kembali -->
          <div class="w-full rounded-2xl border border-blue-200 bg-blue-50/70 p-5 text-left space-y-2">
            <div class="flex items-center gap-2 text-blue-800 font-bold text-sm">
              <span>ℹ️</span> Slot Lapangan Telah Dibuka Kembali
            </div>
            <p class="text-xs text-blue-700 leading-relaxed">
              Jadwal main di <strong>{{ namaLapangan }}</strong> pada tanggal <strong>{{ tanggalFormatted }}</strong> pukul <strong>{{ slot }} WIB</strong> sekarang sudah dapat dibooking kembali oleh Anda atau pengguna lainnya.
            </p>
          </div>

          <!-- Tombol Aksi Pesan Ulang -->
          <div class="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <UiButton class="w-full sm:w-auto">
              <NuxtLink :to="`/lapangan/${booking.lapangan.id}`" class="block w-full text-center">
                Pesan Ulang Lapangan Ini
              </NuxtLink>
            </UiButton>

            <UiButton class="w-full sm:w-auto" variant="outline">
              <NuxtLink to="/lapangan" class="block w-full text-center">
                Lihat Semua Lapangan
              </NuxtLink>
            </UiButton>
          </div>
        </div>
      </UiCard>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { durations } from '~/data/booking'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const api = useApi()

type DetailBooking = {
  id: string
  kode: string
  lapangan: { id: string; judul: string; alamat: string; gambar: string }
  tanggal: string
  slot: string
  jamSelesai: string
  durasi: number
  metode: string
  status: string
  batasPembayaran?: string
  harga?: { sewa: number; layanan: number; total: number }
}

// Detail booking diambil dari backend berdasarkan ?id=... di URL
const { data: booking } = await useAsyncData('konfirmasi', () =>
  api<DetailBooking>(`/api/booking/${route.query.id}`),
)

const tanggal = computed(() => booking.value?.tanggal ?? '')
const durasi = computed(() => booking.value?.durasi ?? 60)
const slot = computed(() => booking.value?.slot ?? '')
const metode = computed(() => booking.value?.metode ?? 'qris')
const jamSelesai = computed(() => booking.value?.jamSelesai ?? '')

const namaLapangan = computed(() => booking.value?.lapangan.judul ?? 'Lapangan')
const durasiLabel = computed(() => {
  const pilihan = durations.find((item) => Number(item.value) === durasi.value)
  return pilihan?.label ?? `${durasi.value} menit`
})

const tanggalFormatted = computed(() => {
  if (!tanggal.value) return '-'
  const date = new Date(`${tanggal.value}T00:00:00`)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
})

const metodeLabel = computed(() => {
  const labels: Record<string, string> = {
    qris: 'Digital Payment (QRIS)',
    va: 'Virtual Account',
    transfer: 'Transfer Bank',
    tunai: 'Pembayaran Tunai',
  }
  return labels[metode.value.toLowerCase()] ?? metode.value
})

const formatCurrency = (value?: number) => {
  if (!value) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

// -------------------------------------------------------------
// TIMER & LOGIKA PEMBATALAN WORKER
// -------------------------------------------------------------
const TOTAL_TIMEOUT = 10 // 10 detik sesuai instruksi
const remainingSeconds = ref(TOTAL_TIMEOUT)
const isPaying = ref(false)
const errorMessage = ref('')
let timerInterval: ReturnType<typeof setInterval> | null = null
let pollingInterval: ReturnType<typeof setInterval> | null = null

const formattedSeconds = computed(() =>
  String(Math.max(0, remainingSeconds.value)).padStart(2, '0'),
)

const progressPercentage = computed(() =>
  Math.max(0, Math.min(100, (remainingSeconds.value / TOTAL_TIMEOUT) * 100)),
)

// Menghitung sisa detik berdasarkan batasPembayaran dari server
const hitungSisaWaktu = () => {
  if (!booking.value?.batasPembayaran) return 0
  const batas = new Date(booking.value.batasPembayaran).getTime()
  const sekarang = Date.now()
  const sisa = Math.ceil((batas - sekarang) / 1000)
  return Math.max(0, sisa)
}

const muatUlangStatus = async () => {
  if (!route.query.id) return
  try {
    const updated = await api<DetailBooking>(`/api/booking/${route.query.id}`)
    if (updated) {
      booking.value = updated
      if (updated.status !== 'Menunggu Pembayaran') {
        hentikanSemuaTimer()
      }
    }
  } catch (err) {
    // Abaikan jika sementara network error
  }
}

const hentikanSemuaTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

onMounted(() => {
  if (booking.value?.status === 'Menunggu Pembayaran') {
    remainingSeconds.value = hitungSisaWaktu()

    // Jika waktu sudah habis saat halaman pertama dibuka
    if (remainingSeconds.value <= 0) {
      muatUlangStatus()
      return
    }

    // Interval hitung mundur per detik
    timerInterval = setInterval(() => {
      remainingSeconds.value--
      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0
        muatUlangStatus()
      }
    }, 1000)

    // Polling setiap 1.5 detik untuk menangkap perubahan status oleh worker background
    pollingInterval = setInterval(() => {
      muatUlangStatus()
    }, 1500)
  }
})

onUnmounted(() => {
  hentikanSemuaTimer()
})

// Handler ketika user menekan tombol "Saya sudah bayar"
const handleSudahBayar = async () => {
  if (!booking.value?.id) return
  isPaying.value = true
  errorMessage.value = ''

  try {
    const response = await api<{ message: string; booking: DetailBooking }>(
      `/api/booking/${booking.value.id}/bayar`,
      { method: 'POST' },
    )

    hentikanSemuaTimer()
    if (response?.booking) {
      booking.value = response.booking
    } else {
      await muatUlangStatus()
    }
  } catch (error: any) {
    errorMessage.value = pesanError(
      error,
      'Gagal memverifikasi pembayaran. Kemungkinan batas waktu telah habis.',
    )
    await muatUlangStatus()
  } finally {
    isPaying.value = false
  }
}
</script>
