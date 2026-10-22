
<template>
  <main class="min-h-screen bg-slate-50/70 pb-16 pt-28">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-8 text-sm text-slate-500">
        <NuxtLink to="/" class="hover:text-primary">Beranda</NuxtLink>
        <span class="mx-2">/</span>
        <NuxtLink to="/profile" class="hover:text-primary">Profile</NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-slate-800">Lapangan Favorit</span>
      </div>

      <div class="mb-8">
        <p class="text-sm font-semibold text-primary">KOLEKSI SAYA</p>
        <h1 class="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Lapangan Favorit
        </h1>
        <p class="mt-3 text-sm text-slate-500 sm:text-base">
          Simpan lapangan yang kamu suka agar lebih mudah ditemukan saat ingin bermain.
        </p>
      </div>

      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <CardsProfileSidebar />

        <section class="min-w-0">
          <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                Koleksi Lapangan
              </h2>
              <p class="mt-1 text-sm text-slate-500">
                {{ favorites.length }} lapangan tersimpan
              </p>
            </div>

            <NuxtLink
              to="/lapangan"
              class="rounded-xl border border-slate-200 bg-white
              px-4 py-2.5 text-sm font-semibold text-slate-700
              transition hover:border-primary hover:text-primary"
            >
              + Cari Lapangan
            </NuxtLink>
          </div>

          <div
            v-if="favorites.length"
            class="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <CardsProfileCardFavorite
              v-for="court in favorites"
              :key="court.id"
              :court="court"
              @remove="removeFavorite"
            />
          </div>

          <CardsProfileEmptyState
            v-else
            icon="♡"
            title="Belum Ada Lapangan Favorit"
            description="Temukan lapangan basket yang kamu sukai, lalu simpan untuk memudahkan booking berikutnya."
            link="/lapangan"
            link-label="Jelajahi Lapangan"
          />
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import type { FavoriteCourt } from '~/types/profile'
import { pesanError } from '~/utils/pesanError'

definePageMeta({ middleware: 'auth' })

const api = useApi()

const { data } = await useAsyncData('favorit', () =>
  api<FavoriteCourt[]>('/api/favorit'),
)
const favorites = ref<FavoriteCourt[]>(data.value ?? [])

// Hapus dari database dulu, baru dari tampilan
const removeFavorite = async (id: string) => {
  try {
    await api(`/api/favorit/${id}`, { method: 'DELETE' })
    favorites.value = favorites.value.filter(
      (court) => court.id !== id,
    )
  } catch (error) {
    alert(pesanError(error, 'Gagal menghapus favorit.'))
  }
}
</script>
