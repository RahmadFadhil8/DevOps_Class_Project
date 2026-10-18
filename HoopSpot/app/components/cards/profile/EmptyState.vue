
<template>
  <div
    class="flex flex-col items-center justify-center rounded-2xl
    border border-dashed border-slate-300 bg-white px-6 py-14 text-center"
  >
    <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
      {{ icon }}
    </div>

    <h3 class="mt-5 text-lg font-bold text-slate-900">
      {{ title }}
    </h3>

    <p class="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
      {{ description }}
    </p>

    <NuxtLink
      v-if="link"
      :to="link"
      class="mt-6 rounded-xl bg-primary px-5 py-3 text-sm
      font-semibold text-white transition hover:opacity-90"
    >
      {{ linkLabel || 'Jelajahi Lapangan' }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    title: string
    description: string
    link?: string
    linkLabel?: string
  }>(),
  {
    link: undefined,
    linkLabel: 'Jelajahi Lapangan',
  },
)
</script>
