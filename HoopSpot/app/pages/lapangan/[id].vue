
<template>
  <main class="min-h-screen bg-slate-50/60 pb-16 pt-24 sm:pt-28">
    <section
      v-if="Data"
      class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <!-- Breadcrumb -->
      <nav class="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <NuxtLink to="/" class="hover:text-primary">Beranda</NuxtLink>
        <span>/</span>
        <NuxtLink to="/lapangan" class="hover:text-primary">
          Lapangan
        </NuxtLink>
        <span>/</span>
        <span class="font-medium text-slate-800">{{ Data.judul }}</span>
      </nav>

      <!-- Heading -->
      <header class="mb-8">
        <div class="flex flex-wrap items-center gap-3">
          <h1 class="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {{ Data.judul }}
          </h1>

          <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Tersedia untuk booking
          </span>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 sm:text-base">
          <div class="flex items-center gap-2">
            <img
              src="~/assets/icon/star.svg"
              alt=""
              class="h-4 w-4"
            />
            <span class="font-semibold text-slate-800">
              {{ Data.rating }}
            </span>
            <span>Rating</span>
          </div>

          <div class="flex items-center gap-2">
            <img
              src="~/assets/icon/location.svg"
              alt=""
              class="h-4 w-4"
            />
            <span>{{ Data.alamat }}</span>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_410px]">
        <!-- Detail Lapangan -->
        <div class="min-w-0 space-y-8">
          <div class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <img
              :src="Data.gambar"
              :alt="Data.judul"
              class="h-64 w-full object-cover sm:h-80 lg:h-107.5"
            />
          </div>

          <!-- Deskripsi -->
          <section>
            <h2 class="text-2xl font-bold text-slate-900">
              Deskripsi Lapangan
            </h2>

            <p class="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              {{ Data.deskripsi }}
            </p>
          </section>

          <!-- Fasilitas -->
          <section>
            <h2 class="text-xl font-bold text-slate-900">
              Fasilitas Lapangan
            </h2>

            <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              <div
                v-for="item in Data.fasilitas"
                :key="item"
                class="flex min-h-20 items-center gap-3 rounded-xl
                border border-slate-200 bg-white p-4 transition
                hover:border-primary/30 hover:shadow-sm"
              >
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  ✓
                </span>
                <span class="text-sm font-medium text-slate-700">
                  {{ item }}
                </span>
              </div>
            </div>
          </section>

          <!-- Catatan -->
          <div class="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <h3 class="font-bold text-blue-900">
              Informasi Booking
            </h3>
            <p class="mt-2 text-sm leading-6 text-blue-800">
              Pastikan tanggal dan waktu yang dipilih sudah sesuai sebelum
              melanjutkan pembayaran. Ketersediaan jadwal perlu dikonfirmasi
              kembali oleh sistem booking.
            </p>
          </div>
        </div>

        <!-- Booking Panel -->
        <aside class="min-w-0 lg:sticky lg:top-24">
          <UiCard class="overflow-hidden p-0">
            <div class="border-b border-slate-100 p-5 sm:p-6">
              <p class="text-sm font-medium text-slate-500">
                Harga sewa mulai dari
              </p>

              <div class="mt-1 flex flex-wrap items-baseline gap-1">
                <span class="text-2xl font-extrabold text-primary">
                  {{ formatCurrency(hargaPerJam) }}
                </span>
                <span class="text-sm text-slate-500">/ jam</span>
              </div>

              <div class="mt-4 flex items-center gap-2 text-sm text-emerald-700">
                <span class="h-2 w-2 rounded-full bg-emerald-500" />
                Pilih jadwal untuk melanjutkan
              </div>
            </div>

            <div class="space-y-6 p-5 sm:p-6">
              <!-- Tanggal -->
              <div>
                <label
                  for="booking-date"
                  class="mb-2 block text-sm font-bold text-slate-800"
                >
                  Pilih Tanggal
                </label>

                <input
                  id="booking-date"
                  v-model="selectedDate"
                  type="date"
                  :min="today"
                  class="w-full rounded-xl border border-slate-200
                  bg-white px-4 py-3 text-sm text-slate-700 outline-none
                  transition focus:border-primary focus:ring-2
                  focus:ring-primary/10"
                />
              </div>

              <!-- Durasi -->
              <fieldset>
                <legend class="mb-3 text-sm font-bold text-slate-800">
                  Durasi Sewa
                </legend>

                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="item in durations"
                    :key="item.value"
                    type="button"
                    class="rounded-xl border px-2 py-3 text-sm font-semibold transition"
                    :class="
                      Number(durasi) === Number(item.value)
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-slate-200 text-slate-600 hover:border-primary/40'
                    "
                    :aria-pressed="Number(durasi) === Number(item.value)"
                    @click="durasi = Number(item.value)"
                  >
                    {{ item.label }}
                  </button>
                </div>
              </fieldset>

              <!-- Slot -->
              <fieldset>
                <legend class="mb-3 text-sm font-bold text-slate-800">
                  Pilih Slot Waktu
                </legend>

                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="slot in timeSlots"
                    :key="slot.value"
                    type="button"
                    class="rounded-xl border px-3 py-3 text-sm font-semibold transition"
                    :class="
                      selectedSlot === String(slot.value)
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                        : 'border-slate-200 text-slate-600 hover:border-primary/40'
                    "
                    :aria-pressed="selectedSlot === String(slot.value)"
                    @click="selectedSlot = String(slot.value)"
                  >
                    {{ slot.label }}
                  </button>
                </div>
              </fieldset>

              <!-- Price Summary -->
              <div class="border-t border-dashed border-slate-200 pt-5">
                <div class="flex justify-between gap-3 text-sm">
                  <span class="text-slate-500">
                    Sewa Lapangan ({{ durasi }} menit)
                  </span>
                  <span class="font-semibold text-slate-800">
                    {{ formatCurrency(hargaSewa) }}
                  </span>
                </div>

                <div class="mt-3 flex justify-between gap-3 text-sm">
                  <span class="text-slate-500">Biaya Layanan</span>
                  <span class="font-semibold text-slate-800">
                    {{ formatCurrency(biayaLayanan) }}
                  </span>
                </div>

                <div class="my-4 border-t border-slate-200" />

                <div class="flex items-center justify-between gap-3">
                  <span class="font-bold text-slate-900">Total</span>
                  <span class="text-xl font-extrabold text-primary">
                    {{ formatCurrency(totalHarga) }}
                  </span>
                </div>
              </div>

              <p
                v-if="bookingError"
                role="alert"
                class="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {{ bookingError }}
              </p>

              <button
                type="button"
                class="flex w-full items-center justify-center gap-2 rounded-xl
                bg-primary px-5 py-3.5 text-sm font-bold text-white
                transition hover:opacity-90 disabled:cursor-not-allowed
                disabled:opacity-40"
                :disabled="!selectedDate || !selectedSlot"
                @click="goToPayment"
              >
                Lanjut ke Pembayaran
                <span>→</span>
              </button>

              <p class="text-center text-xs leading-relaxed text-slate-400">
                Jadwal dan harga akhir perlu diverifikasi sebelum transaksi
                dikonfirmasi.
              </p>
            </div>
          </UiCard>
        </aside>
      </div>
    </section>

    <!-- Lapangan tidak ditemukan -->
    <section v-else class="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 class="text-2xl font-bold text-slate-900">
        Lapangan tidak ditemukan
      </h1>
      <p class="mt-3 text-slate-500">
        Lapangan yang kamu cari tidak tersedia atau telah dihapus.
      </p>
      <NuxtLink
        to="/lapangan"
        class="mt-6 inline-flex rounded-xl bg-primary px-5 py-3
        text-sm font-bold text-white hover:opacity-90"
      >
        Kembali ke Daftar Lapangan
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DataLapangan } from '~/data/lapangan'
import { durations, timeSlots } from '~/data/booking'

const route = useRoute()
const router = useRouter()

const LapanganId = Number(route.params.id)

const Data = DataLapangan.find(
  (item) => item.id === LapanganId,
)

// Sesuaikan "harga" jika nama properti harga di datamu berbeda.
const hargaPerJam = computed(() =>
  Number(Data?.harga ?? 250000),
)

const durasi = ref<number>(
  Number(durations[0]?.value ?? 90),
)

const selectedDate = ref('')
const selectedSlot = ref('')
const bookingError = ref('')

const biayaLayanan = 5000

const hargaSewa = computed(() =>
  Math.round(hargaPerJam.value * durasi.value / 60),
)

const totalHarga = computed(() =>
  hargaSewa.value + biayaLayanan,
)

const today = (() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
})()

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const goToPayment = async () => {
  bookingError.value = ''

  if (!Data) {
    bookingError.value = 'Data lapangan tidak ditemukan.'
    return
  }

  if (!selectedDate.value || !selectedSlot.value) {
    bookingError.value = 'Silakan pilih tanggal dan slot waktu.'
    return
  }

  if (selectedDate.value < today) {
    bookingError.value = 'Tanggal booking tidak boleh di masa lalu.'
    return
  }

  await router.push({
    path: '/pembayaran',
    query: {
      lapanganId: String(Data.id),
      tanggal: selectedDate.value,
      durasi: String(durasi.value),
      slot: selectedSlot.value,
    },
  })
}
</script>
