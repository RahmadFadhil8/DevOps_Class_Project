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
const Data: Statistik[] = [
    {
        judul: "Total Revenue",
        jumlah: 125
    },
    {
        judul: "Total Booking",
        jumlah: 125
    },
    {
        judul: "Active Users",
        jumlah: 125
    },
    {
        judul: "Active Users",
        jumlah: 125
    }
]
</script>