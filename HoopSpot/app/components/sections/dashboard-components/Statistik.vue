<template>
    <div class="grid grid-cols-4 gap-12">
        <CardsDashboardStatistik
        v-for="item in Data"
        :key="item.judul"
        :statistik="item"
        />
    </div>
</template>
<script setup lang="ts">
import type {Statistik} from '~/types'

// Endpoint admin: butuh token admin (login sebagai admin@hoopspot.com)
const api = useApi()
const { data: Data } = await useAsyncData('admin-stats', () =>
    api<Statistik[]>('/api/admin/stats'),
    { default: () => [] }
)
</script>