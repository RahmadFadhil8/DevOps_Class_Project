<template>
    <UiCard>
        <div>
            <img :src="lapangan.gambar" :alt="lapangan.judul" class="rounded-t-xl">
                <div class="px-4 py-4">
                    <div class="flex justify-between items-center">
                        <p class="font-bold">{{ lapangan.judul }}</p>
                        <div class="flex gap-1 items-center text-gray-400 text-sm font-bold">
                            <img src="~/assets/icon/star.svg" alt="" class="h-4 w-4">
                            <p class="">{{ lapangan.rating }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-1 mt-1">
                        <img src="~/assets/icon/location.svg" alt="" class="h-4 w-4">
                        <p class="text-xs">{{ lapangan.alamat }}</p>
                    </div>
        
                    <div class="flex justify-between items-center mt-10">
                        <div>
                            <p class="text-sm">Mulai dari</p>
                            <p class="font-bold text-lg">Rp {{ lapangan.harga }}</p>
                        </div>
                        <div>
                            <UiButton>
                                <NuxtLink :to="`/lapangan/${lapangan.id}`">
                                    Pesan
                                </NuxtLink>
                            </UiButton>
                        </div>
                    </div>
                </div>
        </div>
    </UiCard>
</template>

<script setup lang="ts">
import type {Lapangan} from "~/types"
defineProps<{
    lapangan:Lapangan
}>()
</script>