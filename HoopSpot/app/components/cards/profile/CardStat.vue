
<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-5
    transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
  >
    <div class="flex items-center justify-between gap-3">
      <p class="text-sm font-medium text-slate-500">
        {{ label }}
      </p>

      <span
        class="flex h-10 w-10 items-center justify-center
        rounded-xl bg-primary/10 text-xl text-primary"
      >
        {{ icon }}
      </span>
    </div>

    <p class="mt-4 text-2xl font-extrabold text-slate-900">
      {{ value }}
    </p>

    <p v-if="description" class="mt-1 text-xs text-slate-500">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  description?: string
}>()
</script>
