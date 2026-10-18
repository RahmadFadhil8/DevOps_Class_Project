
<template>
  <main class="min-h-screen bg-slate-50/70 pb-16 pt-24 sm:pt-28">
    <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Heading -->
      <div class="mb-8">
        <nav class="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <NuxtLink to="/" class="hover:text-primary">Beranda</NuxtLink>
          <span>/</span>
          <NuxtLink to="/lapangan" class="hover:text-primary">
            Lapangan
          </NuxtLink>
          <span>/</span>
          <span class="text-slate-800">Pembayaran</span>
        </nav>

        <p class="text-sm font-semibold text-primary">
          LANGKAH TERAKHIR
        </p>
        <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Konfirmasi & Pembayaran
        </h1>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          Periksa detail booking, lengkapi informasi kontak, dan pilih metode
          pembayaran yang tersedia.
        </p>
      </div>

      <div
        v-if="!Data"
        class="rounded-2xl border border-slate-200 bg-white p-8 text-center"
      >
        <h2 class="text-xl font-bold text-slate-900">
          Data booking tidak ditemukan
        </h2>
        <p class="mt-2 text-sm text-slate-500">
          Silakan pilih lapangan terlebih dahulu sebelum melanjutkan pembayaran.
        </p>
        <NuxtLink
          to="/lapangan"
          class="mt-5 inline-flex rounded-xl bg-primary px-5 py-3
          text-sm font-bold text-white hover:opacity-90"
        >
          Pilih Lapangan
        </NuxtLink>
      </div>

      <form
        v-else
        class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_420px]"
        @submit.prevent="submitPayment"
      >
        <!-- Left Column -->
        <div class="min-w-0 space-y-6">
          <!-- Contact -->
          <UiCard class="p-5 sm:p-7">
            <div class="flex items-start gap-3">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <img
                  src="~/assets/icon/user.svg"
                  alt=""
                  class="h-5 w-5"
                />
              </div>

              <div>
                <h2 class="text-lg font-bold text-slate-900">
                  Informasi Kontak
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                  Informasi ini digunakan untuk konfirmasi booking.
                </p>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  for="nama"
                  class="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Nama Lengkap
                </label>
                <UiInput
                  v-model="nama"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  :icon="user"
                />
              </div>

              <div>
                <label
                  for="email"
                  class="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Konfirmasi
                </label>
                <UiInput
                  v-model="email"
                  type="email"
                  placeholder="nama@email.com"
                  :icon="emaill"
                />
              </div>
            </div>
          </UiCard>

          <!-- Payment Methods -->
          <UiCard class="p-5 sm:p-7">
            <div class="flex items-start gap-3">
              <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <img
                  src="~/assets/icon/wallet.svg"
                  alt=""
                  class="h-5 w-5"
                />
              </div>

              <div>
                <h2 class="text-lg font-bold text-slate-900">
                  Metode Pembayaran
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                  Pilih metode pembayaran yang ingin digunakan.
                </p>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="flex cursor-pointer items-center gap-4 rounded-xl
                border p-4 transition"
                :class="
                  paymentMethod === method.value
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-slate-200 hover:border-primary/40'
                "
              >
                <input
                  v-model="paymentMethod"
                  type="radio"
                  name="paymentMethod"
                  :value="method.value"
                  class="h-4 w-4 accent-primary"
                />

                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  {{ method.icon }}
                </div>

                <div class="min-w-0 flex-1">
                  <p class="font-semibold text-slate-800">
                    {{ method.label }}
                  </p>
                  <p class="mt-1 text-xs leading-relaxed text-slate-500">
                    {{ method.description }}
                  </p>
                </div>

                <span
                  v-if="method.recommended"
                  class="hidden rounded-full bg-emerald-50 px-2.5 py-1
                  text-xs font-semibold text-emerald-700 sm:inline-flex"
                >
                  Praktis
                </span>
              </label>
            </div>

            <p class="mt-4 text-xs leading-relaxed text-slate-400">
              Pilihan di atas merupakan contoh UI. Pembayaran belum diproses
              melalui payment gateway.
            </p>
          </UiCard>

          <!-- Error -->
          <div
            v-if="errorMessage"
            role="alert"
            class="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            {{ errorMessage }}
          </div>
        </div>

        <!-- Right Column: Booking Summary -->
        <aside class="min-w-0 lg:sticky lg:top-24">
          <UiCard class="overflow-hidden p-0">
            <div class="relative">
              <img
                :src="Data.gambar"
                :alt="Data.judul"
                class="h-52 w-full object-cover"
              />
              <span class="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-bold text-primary">
                Detail Booking
              </span>
            </div>

            <div class="p-5 sm:p-6">
              <h2 class="text-xl font-extrabold text-slate-900">
                {{ Data.judul }}
              </h2>

              <p class="mt-2 flex items-start gap-2 text-sm leading-relaxed text-slate-500">
                <img
                  src="~/assets/icon/location.svg"
                  alt=""
                  class="mt-0.5 h-4 w-4 shrink-0"
                />
                {{ Data.alamat }}
              </p>

              <div class="my-5 border-t border-slate-100" />

              <!-- Booking Information -->
              <div class="grid grid-cols-2 gap-x-4 gap-y-5">
                <div>
                  <p class="text-xs text-slate-400">Tanggal</p>
                  <p class="mt-1 text-sm font-bold text-slate-800">
                    {{ formatDate(tanggal) }}
                  </p>
                </div>

                <div>
                  <p class="text-xs text-slate-400">Jam Bermain</p>
                  <p class="mt-1 text-sm font-bold text-slate-800">
                    {{ slot }}
                  </p>
                </div>

                <div>
                  <p class="text-xs text-slate-400">Durasi</p>
                  <p class="mt-1 text-sm font-bold text-slate-800">
                    {{ durasi }} menit
                  </p>
                </div>

                <div>
                  <p class="text-xs text-slate-400">Rating Lapangan</p>
                  <p class="mt-1 flex items-center gap-1 text-sm font-bold text-slate-800">
                    <img
                      src="~/assets/icon/star.svg"
                      alt=""
                      class="h-4 w-4"
                    />
                    {{ Data.rating }}
                  </p>
                </div>
              </div>

              <div class="my-5 border-t border-dashed border-slate-200" />

              <!-- Price Breakdown -->
              <div class="space-y-3 text-sm">
                <div class="flex items-start justify-between gap-3">
                  <span class="text-slate-500">
                    Sewa Lapangan ({{ durasi }} menit)
                  </span>
                  <span class="shrink-0 font-semibold text-slate-800">
                    {{ formatCurrency(hargaSewa) }}
                  </span>
                </div>

                <div class="flex items-center justify-between gap-3">
                  <span class="text-slate-500">Biaya Layanan</span>
                  <span class="font-semibold text-slate-800">
                    {{ formatCurrency(biayaLayanan) }}
                  </span>
                </div>
              </div>

              <div class="my-5 border-t border-slate-200" />

              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-bold text-slate-900">Total Bayar</p>
                  <p class="mt-1 text-xs text-slate-400">
                    Termasuk biaya layanan
                  </p>
                </div>

                <p class="text-xl font-extrabold text-primary">
                  {{ formatCurrency(totalHarga) }}
                </p>
              </div>

              <button
                type="submit"
                class="mt-6 flex w-full items-center justify-center gap-2
                rounded-xl bg-primary px-5 py-3.5 text-sm font-bold
                text-white transition hover:opacity-90"
              >
                Konfirmasi Booking
                <span>→</span>
              </button>

              <p class="mt-4 text-center text-xs leading-relaxed text-slate-400">
                Dengan melanjutkan, kamu menyetujui ketentuan booking yang berlaku.
              </p>
            </div>
          </UiCard>

          <NuxtLink
            :to="`/lapangan/${Data.id}`"
            class="mt-4 flex items-center justify-center gap-2 rounded-xl
            border border-slate-200 bg-white px-4 py-3 text-sm
            font-semibold text-slate-600 transition hover:border-primary
            hover:text-primary"
          >
            ← Ubah Pilihan Booking
          </NuxtLink>
        </aside>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { DataLapangan } from '~/data/lapangan'
import emaill from '~/assets/icon/email-hitam.svg'
import user from '~/assets/icon/user.svg'

const route = useRoute()

const lapanganId = Number(route.query.lapanganId)
const Data = DataLapangan.find(
  (item) => item.id === lapanganId,
)

const tanggal = computed(() =>
  typeof route.query.tanggal === 'string'
    ? route.query.tanggal
    : '',
)

const durasi = computed(() => {
  const value = Number(route.query.durasi)
  return Number.isFinite(value) && value > 0 ? value : 90
})

const slot = computed(() =>
  typeof route.query.slot === 'string'
    ? route.query.slot
    : '',
)

// Contoh informasi kontak; ganti dengan data pengguna login jika tersedia.
const nama = ref('')
const email = ref('')
const paymentMethod = ref('qris')
const errorMessage = ref('')

const paymentMethods = [
  {
    value: 'qris',
    label: 'Digital Payment (QRIS)',
    description: 'GoPay, OVO, DANA, ShopeePay, dan aplikasi QRIS.',
    icon: '▦',
    recommended: true,
  },
  {
    value: 'va',
    label: 'Virtual Account',
    description: 'Pembayaran melalui transfer bank.',
    icon: '▤',
    recommended: false,
  },
]

const hargaPerJam = computed(() =>
  Number(Data?.harga ?? 250000),
)

const biayaLayanan = 5000

const hargaSewa = computed(() =>
  Math.round(hargaPerJam.value * durasi.value / 60),
)

const totalHarga = computed(() =>
  hargaSewa.value + biayaLayanan,
)

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)

const formatDate = (value: string) => {
  if (!value) return '-'

  const date = new Date(`${value}T12:00:00`)

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const submitPayment = async () => {
  errorMessage.value = ''

  if (!Data || !tanggal.value || !slot.value) {
    errorMessage.value =
      'Detail booking tidak lengkap. Silakan pilih ulang lapangan dan jadwal.'
    return
  }

  if (!nama.value.trim()) {
    errorMessage.value = 'Nama lengkap wajib diisi.'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errorMessage.value = 'Masukkan alamat email yang valid.'
    return
  }

  if (!paymentMethod.value) {
    errorMessage.value = 'Pilih metode pembayaran terlebih dahulu.'
    return
  }

  // Belum membuat transaksi sungguhan.
  // Selanjutnya kirim data ke endpoint server untuk validasi,
  // pengecekan slot, dan pembuatan booking/payment.
  await navigateTo({
    path: '/konfirmasi',
    query: {
      lapanganId: String(Data.id),
      tanggal: tanggal.value,
      durasi: String(durasi.value),
      slot: slot.value,
      metode: paymentMethod.value,
      nama: nama.value.trim(),
      email: email.value.trim(),
    },
  })
}
</script>
