
<template>
  <main class="min-h-screen bg-slate-50/70 pb-16 pt-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8 text-sm text-slate-500">
        <NuxtLink to="/" class="hover:text-primary">Beranda</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/profile" class="hover:text-primary">Profile</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-slate-800">Riwayat Booking</span>
      </div>

      <div class="mb-8">
        <p class="text-sm font-semibold text-primary">AKTIVITAS SAYA</p>
        <h1 class="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Riwayat Booking
        </h1>
        <p class="mt-3 text-sm text-slate-500 sm:text-base">
          Lihat jadwal pertandingan dan riwayat pemesanan lapanganmu.
        </p>
      </div>

      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <ProfileSidebar />

        <section class="min-w-0 space-y-5">
          <!-- Search and filter -->
          <div class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
            <label for="booking-search" class="mb-2 block text-sm font-semibold text-slate-700">
              Cari Booking
            </label>

            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
              <input
                id="booking-search"
                v-model="search"
                type="search"
                placeholder="Nama lapangan atau kode booking..."
                class="w-full rounded-xl border border-slate-200 py-3 pl-10
                pr-4 text-sm outline-none transition placeholder:text-slate-400
                focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div class="mt-4 flex gap-2 overflow-x-auto pb-1">
              <button
                v-for="tab in tabs"
                :key="tab.value"
                type="button"
                class="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition"
                :class="
                  activeTab === tab.value
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                "
                @click="activeTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Results -->
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-slate-500">
              Menampilkan
              <span class="font-bold text-slate-800">{{ filteredBookings.length }}</span>
              booking
            </p>
          </div>

          <div v-if="filteredBookings.length" class="space-y-4">
            <CardBooking
              v-for="booking in filteredBookings"
              :key="booking.id"
              :booking="booking"
            />
          </div>

          <EmptyState
            v-else
            icon="▤"
            title="Booking tidak ditemukan"
            description="Coba gunakan kata kunci lain atau ubah filter status booking."
            link="/lapangan"
            link-label="Cari Lapangan"
          />
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { bookingData } from '~/data/profile'
import type { BookingStatus } from '~/types/profile'

type FilterValue = 'all' | BookingStatus

const search = ref('')
const activeTab = ref<FilterValue>('all')

const tabs: { label: string; value: FilterValue }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Akan Datang', value: 'upcoming' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Dibatalkan', value: 'cancelled' },
]

const filteredBookings = computed(() => {
  const keyword = search.value.trim().toLowerCase()

  return [...bookingData]
    .filter((booking) => {
      const matchesStatus =
        activeTab.value === 'all' ||
        booking.status === activeTab.value

      const matchesSearch =
        booking.namaLapangan.toLowerCase().includes(keyword) ||
        booking.kode.toLowerCase().includes(keyword)

      return matchesStatus && matchesSearch
    })
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
})
</script>
