<template>
  <main class="min-h-screen bg-gray-50 px-4 py-12 pt-24 sm:px-6">
    <section class="mx-auto flex w-full max-w-3xl justify-center">
      <UiCard class="w-full p-5 sm:p-8 md:p-10">
        <div class="flex flex-col items-center gap-5">
          <!-- Status booking -->
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 sm:h-24 sm:w-24">
            <img
              src="~/assets/icon/check.svg"
              alt="Booking berhasil"
              class="h-12 w-12 sm:h-14 sm:w-14"
            >
          </div>

          <div class="space-y-2 text-center">
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
              Booking Berhasil!
            </h1>
            <p class="mx-auto max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
              Pesanan Anda telah dikonfirmasi. Siapkan perlengkapan Anda dan sampai jumpa di lapangan!
            </p>
          </div>

          <UiBadge>
            Booking berhasil
          </UiBadge>

          <!-- Informasi lapangan -->
          <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <UiCard class="p-5">
              <div class="mb-3 flex items-center gap-2">
                <img
                  src="~/assets/icon/tennis.svg"
                  alt=""
                  class="h-6 w-6"
                >
                <p class="text-sm text-gray-500">Lapangan</p>
              </div>

              <p class="font-semibold text-gray-900">
                {{ namaLapangan }}
              </p>
            </UiCard>

            <UiCard class="p-5">
              <div class="mb-3 flex items-center gap-2">
                <img
                  src="~/assets/icon/calendar.svg"
                  alt=""
                  class="h-6 w-6"
                >
                <p class="text-sm text-gray-500">Tanggal dan Waktu</p>
              </div>

              <p class="font-semibold text-gray-900">
                {{ tanggalFormatted }}
              </p>

              <p class="mt-1 text-sm text-gray-600">
                {{ slot || '-' }}–{{ jamSelesai || '-' }} WIB
              </p>

              <p class="mt-1 text-sm text-gray-500">
                Durasi {{ durasiLabel }}
              </p>
            </UiCard>

            <!-- Informasi pembayaran -->
            <UiCard class="p-5 sm:col-span-2">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-start gap-3">
                  <img
                    src="~/assets/icon/barcode.svg"
                    alt=""
                    class="h-6 w-6 shrink-0"
                  >

                  <div>
                    <p class="font-semibold text-gray-900">
                      {{ metodeLabel }}
                    </p>
                    <p class="mt-1 text-sm leading-5 text-gray-500">
                      Metode pembayaran yang dipilih saat pemesanan.
                    </p>
                  </div>
                </div>

                <UiBadge>
                  Menunggu verifikasi
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

            <UiButton class="w-full sm:w-auto">
              <NuxtLink to="/" class="block w-full text-center">
                Kembali ke Beranda
              </NuxtLink>
            </UiButton>
          </div>

          <p class="text-center text-xs leading-5 text-gray-400">
            Simpan informasi pemesanan ini untuk referensi Anda.
          </p>
        </div>
      </UiCard>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DataLapangan } from '~/data/lapangan'
import { durations } from '~/data/booking'

const route = useRoute()

const lapanganId = computed(() => String(route.query.lapanganId ?? ''))
const tanggal = computed(() => String(route.query.tanggal ?? ''))
const durasi = computed(() => Number(route.query.durasi ?? 60))
const slot = computed(() => String(route.query.slot ?? ''))
const metode = computed(() => String(route.query.metode ?? 'qris'))

const lapangan = computed(() =>
  DataLapangan.find((item) => String(item.id) === lapanganId.value)
)

const namaLapangan = computed(() => lapangan.value?.judul ?? 'Lapangan')
const durasiLabel = computed(() => {
  const pilihan = durations.find((item) => Number(item.value) === durasi.value)
  return pilihan?.label ?? `${durasi.value} menit`
})

const jamSelesai = computed(() => {
  if (!slot.value) return ''

  const [jam, menit] = slot.value.split(':').map(Number)
  const totalMenit = jam! * 60 + menit! + durasi.value

  return `${String(Math.floor(totalMenit / 60) % 24).padStart(2, '0')}:${String(totalMenit % 60).padStart(2, '0')}`
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
    transfer: 'Transfer Bank',
    tunai: 'Pembayaran Tunai',
  }

  return labels[metode.value.toLowerCase()] ?? metode.value
})
</script>