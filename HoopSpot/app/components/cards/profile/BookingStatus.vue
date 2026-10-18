
<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-3 py-1
    text-xs font-semibold"
    :class="statusStyle"
  >
    <span class="h-1.5 w-1.5 rounded-full bg-current" />
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import type { BookingStatus as Status } from '~/types/profile'

const props = defineProps<{
  status: Status
}>()

const statusMap = {
  upcoming: {
    label: 'Akan Datang',
    style: 'bg-blue-50 text-blue-700',
  },
  completed: {
    label: 'Selesai',
    style: 'bg-emerald-50 text-emerald-700',
  },
  cancelled: {
    label: 'Dibatalkan',
    style: 'bg-red-50 text-red-700',
  },
}

const statusLabel = computed(() => statusMap[props.status].label)
const statusStyle = computed(() => statusMap[props.status].style)
</script>
