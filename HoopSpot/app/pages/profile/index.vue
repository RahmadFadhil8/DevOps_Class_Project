
<template>
  <main class="min-h-screen bg-slate-50/70 pb-16 pt-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <div class="mb-8 text-sm text-slate-500">
        <NuxtLink to="/" class="transition hover:text-primary">
          Beranda
        </NuxtLink>
        <span class="mx-2">/</span>
        <span class="font-medium text-slate-800">Profile Saya</span>
      </div>

      <!-- Heading -->
      <div class="mb-8">
        <p class="text-sm font-semibold text-primary">
          AKUN SAYA
        </p>
        <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Profile Saya
        </h1>
        <p class="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
          Kelola akun dan pantau aktivitas booking lapangan basketmu.
        </p>
      </div>

      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <CardsProfileSidebar />

        <div class="min-w-0 space-y-6">
          <!-- Welcome Card -->
          <section
            class="relative overflow-hidden rounded-2xl bg-primary
            p-6 text-white sm:p-8"
          >
            <div class="relative z-10 max-w-lg">
              <p class="text-sm font-medium text-white/70">
                Selamat datang kembali!
              </p>
              <h2 class="mt-2 text-2xl font-extrabold sm:text-3xl">
                Halo, {{ user.nama.split(' ')[0] }}! 👋
              </h2>
              <p class="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
                Siap bermain basket? Cek jadwal booking-mu atau temukan
                lapangan baru untuk pertandingan berikutnya.
              </p>
              <NuxtLink
                to="/lapangan"
                class="mt-6 inline-flex items-center gap-2 rounded-xl
                bg-white px-5 py-3 text-sm font-bold text-primary
                transition hover:bg-slate-100"
              >
                Cari Lapangan
                <span>→</span>
              </NuxtLink>
            </div>

            <div
              class="absolute -right-10 -top-16 h-56 w-56 rounded-full
              border-32 border-white/10"
            />
            <div
              class="absolute -bottom-20 right-24 h-40 w-40 rounded-full
              bg-white/5"
            />
          </section>

          <!-- Statistics -->
          <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <CardsProfileCardStat
              label="Total Booking"
              :value="bookingData.length"
              icon="▤"
              description="Seluruh aktivitas booking"
            />
            <CardsProfileCardStat
              label="Akan Datang"
              :value="upcomingCount"
              icon="◷"
              description="Jadwal yang akan berlangsung"
            />
            <CardsProfileCardStat
              label="Lapangan Favorit"
              :value="favoriteData.length"
              icon="♡"
              description="Lapangan yang kamu simpan"
            />
          </section>

          <!-- Personal Information -->
          <section class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 class="text-lg font-bold text-slate-900">
                  Informasi Pribadi
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                  Informasi dasar akun HoopSpot kamu.
                </p>
              </div>

              <NuxtLink
                to="/profile/settings"
                class="rounded-xl border border-slate-200 px-4 py-2.5
                text-sm font-semibold text-slate-700 transition
                hover:border-primary hover:text-primary"
              >
                Edit Profile
              </NuxtLink>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <p class="text-sm text-slate-400">Nama Lengkap</p>
                <p class="mt-1 font-semibold text-slate-800">
                  {{ user.nama }}
                </p>
              </div>

              <div>
                <p class="text-sm text-slate-400">Email</p>
                <p class="mt-1 break-all font-semibold text-slate-800">
                  {{ user.email }}
                </p>
              </div>

              <div>
                <p class="text-sm text-slate-400">Nomor Telepon</p>
                <p class="mt-1 font-semibold text-slate-800">
                  {{ user.telepon }}
                </p>
              </div>

              <div>
                <p class="text-sm text-slate-400">Lokasi</p>
                <p class="mt-1 font-semibold text-slate-800">
                  {{ user.lokasi }}
                </p>
              </div>
            </div>
          </section>

          <!-- Recent Bookings -->
          <section class="space-y-4">
            <div class="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 class="text-lg font-bold text-slate-900">
                  Booking Terbaru
                </h2>
                <p class="mt-1 text-sm text-slate-500">
                  Pantau aktivitas booking lapanganmu.
                </p>
              </div>

              <NuxtLink
                to="/profile/booking-history"
                class="text-sm font-semibold text-primary hover:underline"
              >
                Lihat Semua →
              </NuxtLink>
            </div>

            <CardsProfileCardBooking
              v-for="booking in recentBookings"
              :key="booking.id"
              :booking="booking"
            />
          </section>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { useProfile } from '~/composables/useProfile'
import type { Booking, FavoriteCourt } from '~/types/profile'

definePageMeta({ middleware: 'auth' })

const api = useApi()

const { user } = await useProfile()

const { data: bookingRes } = await useAsyncData('profile-booking', () =>
  api<Booking[]>('/api/profile/booking'),
)
const { data: favoriteRes } = await useAsyncData('favorit', () =>
  api<FavoriteCourt[]>('/api/favorit'),
)

const bookingData = computed(() => bookingRes.value ?? [])
const favoriteData = computed(() => favoriteRes.value ?? [])

const upcomingCount = computed(
  () => bookingData.value.filter((item) => item.status === 'upcoming').length,
)

const recentBookings = computed(() =>
  [...bookingData.value]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 2),
)
</script>
