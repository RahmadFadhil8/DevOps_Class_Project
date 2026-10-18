
<template>
  <aside class="w-full lg:w-72 lg:shrink-0">
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-center gap-4">
        <div
          class="flex h-14 w-14 shrink-0 items-center justify-center
          overflow-hidden rounded-full bg-primary/10 text-lg
          font-bold text-primary"
        >
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.nama"
            class="h-full w-full object-cover"
          />
          <span v-else>{{ initials }}</span>
        </div>

        <div class="min-w-0">
          <h2 class="truncate font-bold text-slate-900">
            {{ user.nama }}
          </h2>
          <p class="truncate text-sm text-slate-500">
            {{ user.email }}
          </p>
          <p class="mt-1 text-xs font-medium text-primary">
            Member HoopSpot
          </p>
        </div>
      </div>

      <div class="my-5 border-t border-slate-100" />

      <nav class="flex gap-2 overflow-x-auto lg:flex-col">
        <NuxtLink
          v-for="item in menu"
          :key="item.to"
          :to="item.to"
          class="flex shrink-0 items-center gap-3 rounded-xl
          px-4 py-3 text-sm font-medium transition-colors"
          :class="
            route.path === item.to
              ? 'bg-primary text-white'
              : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
          "
        >
          <span class="w-5 text-center">{{ item.icon }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>

    <div class="mt-4 rounded-2xl bg-primary p-5 text-white">
      <p class="text-sm font-semibold">Siap bermain basket?</p>
      <p class="mt-2 text-sm leading-relaxed text-white/75">
        Temukan lapangan dan jadwal yang cocok untukmu.
      </p>
      <NuxtLink
        to="/lapangan"
        class="mt-4 inline-flex rounded-xl bg-white px-4 py-2.5
        text-sm font-semibold text-primary transition hover:bg-slate-100"
      >
        Cari Lapangan
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { profileUser } from '~/data/profile'

const route = useRoute()
const user = profileUser

const initials = computed(() =>
  user.nama
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

const menu = [
  { label: 'Profile Saya', to: '/profile', icon: '◉' },
  {
    label: 'Riwayat Booking',
    to: '/profile/booking-history',
    icon: '▤',
  },
  { label: 'Lapangan Favorit', to: '/profile/favorit', icon: '♡' },
  { label: 'Pengaturan', to: '/profile/settings', icon: '⚙' },
]
</script>
