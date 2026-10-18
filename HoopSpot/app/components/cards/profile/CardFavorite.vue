
<template>
  <article
    class="group overflow-hidden rounded-2xl border border-slate-200
    bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div class="relative overflow-hidden">
      <img
        :src="court.gambar"
        :alt="court.nama"
        class="h-48 w-full object-cover transition duration-500
        group-hover:scale-105"
      />

      <button
        type="button"
        aria-label="Hapus dari favorit"
        title="Hapus dari favorit"
        class="absolute right-3 top-3 flex h-10 w-10 items-center
        justify-center rounded-full bg-white/95 text-xl text-red-500
        shadow-sm transition hover:bg-red-50"
        @click="$emit('remove', court.id)"
      >
        ♥
      </button>

      <span
        class="absolute bottom-3 left-3 rounded-lg bg-white/95
        px-3 py-1.5 text-sm font-bold text-slate-800"
      >
        ★ {{ court.rating.toFixed(1) }}
      </span>
    </div>

    <div class="p-5">
      <h3 class="text-lg font-bold text-slate-900">
        {{ court.nama }}
      </h3>

      <p class="mt-1 text-sm text-slate-500">
        ⌖ {{ court.lokasi }}
      </p>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="fasilitas in court.fasilitas"
          :key="fasilitas"
          class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs
          font-medium text-slate-600"
        >
          {{ fasilitas }}
        </span>
      </div>

      <div class="mt-5 flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
        <div>
          <p class="text-xs text-slate-400">Mulai dari</p>
          <p class="mt-1 font-extrabold text-primary">
            {{ formatCurrency(court.harga) }}
          </p>
          <p class="text-xs text-slate-400">/ jam</p>
        </div>

        <NuxtLink
          to="/lapangan"
          class="rounded-xl bg-primary px-4 py-2.5 text-sm
          font-semibold text-white transition hover:opacity-90"
        >
          Lihat Lapangan
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { FavoriteCourt } from '~/types/profile'

defineProps<{
  court: FavoriteCourt
}>()

defineEmits<{
  remove: [id: string]
}>()

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
</script>
