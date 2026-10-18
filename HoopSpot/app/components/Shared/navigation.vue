<template>
  <nav
    class="fixed left-1/2 top-2 z-50 flex w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-xl border border-gray-300 bg-neutral px-4 py-2 shadow-lg sm:px-6"
  >
    <!-- Logo -->
    <NuxtLink to="/" class="shrink-0">
      <img
        src="~/assets/images/logo3.png"
        alt="Logo Padel Booking"
        class="h-10 w-auto sm:h-12"
      >
    </NuxtLink>

    <!-- Navigasi -->
    <ul class="hidden items-center gap-6 md:flex">
      <li>
        <NuxtLink to="/" class="hover:text-hover-primary">
          Beranda
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/lapangan" class="hover:text-hover-primary">
          Lapangan
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/#lokasi" class="hover:text-hover-primary">
          Lokasi
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/#faq" class="hover:text-hover-primary">
          FAQ
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/#tentang-kami" class="hover:text-hover-primary">
          Tentang Kami
        </NuxtLink>
      </li>
    </ul>

    <!-- Tombol Login / Profile -->
    <div>
      <UiButton v-if="!isLoggedIn">
        <NuxtLink to="/auth/login" class="flex items-center gap-2">
          <icon name="log-in" size="18" />
          Login
        </NuxtLink>
      </UiButton>

      <NuxtLink
        v-else
        to="/profile"
        aria-label="Buka profile"
        title="Profile"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-100 hover:text-hover-primary"
      >
        <icon name="user-round" size="22" />
      </NuxtLink>
    </div>
  </nav>
</template>
<script setup lang="ts">
const { isLoggedIn } = useAuth()
</script>