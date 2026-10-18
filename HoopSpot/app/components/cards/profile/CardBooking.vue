
<template>
  <article
    class="overflow-hidden rounded-2xl border border-slate-200
    bg-white transition hover:shadow-md"
  >
    <div class="flex flex-col sm:flex-row">
      <img
        :src="booking.gambar"
        :alt="booking.namaLapangan"
        class="h-48 w-full object-cover sm:h-auto sm:w-52"
      />

      <div class="flex min-w-0 flex-1 flex-col p-5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-medium text-slate-400">
            {{ booking.kode }}
          </span>
          <BookingStatus :status="booking.status" />
        </div>

        <h3 class="mt-3 text-lg font-bold text-slate-900">
          {{ booking.namaLapangan }}
        </h3>

        <p class="mt-1 text-sm text-slate-500">
          <span class="mr-1">⌖</span>{{ booking.lokasi }}
        </p>

        <div class="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>📅 {{ formatDate(booking.tanggal) }}</p>
          <p>◷ {{ booking.jam }} WIB</p>
          <p>Durasi: {{ booking.durasi }} jam</p>
          <p class="font-bold text-primary">
            {{ formatCurrency(booking.harga) }}
          </p>
        </div>

        <div class="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <NuxtLink
            v-if="booking.status === 'upcoming'"
            to="/profile/booking-history"
            class="rounded-xl bg-primary px-4 py-2.5 text-sm
            font-semibold text-white transition hover:opacity-90"
          >
            Lihat Booking
          </NuxtLink>

          <NuxtLink
            v-if="booking.status === 'completed'"
            to="/lapangan"
            class="rounded-xl border border-slate-200 px-4 py-2.5
            text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Booking Lagi
          </NuxtLink>

          <span
            v-if="booking.status === 'cancelled'"
            class="text-sm text-slate-400"
          >
            Booking ini telah dibatalkan.
          </span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Booking } from '~/types/profile'

defineProps<{
  booking: Booking
}>()

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
</script>
