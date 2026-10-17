<template>
    <section class="flex flex-col gap-8 px-36 my-40">
        <div class="flex justify-between">
            <div>
                <h6 class="text-2xl font-bold mb-1">Lapangan Terpopuler</h6>
                <p class="text-gray-400">Pilih Lapangan terbaik dengan fasilitas premium</p>
            </div>
            <div class="flex items-end text-gray-400">
                <NuxtLink to="/lapangan" class="flex gap-2 hover:underline">
                    lihat semua
                    <img src="~/assets/icon/link.svg" alt="" class="h-5 w-5 mt-0.5 opacity-40 hover:underline">
                </NuxtLink>
            </div>
        </div>
        <div class="flex gap-4">
            <CardsCourtProduct
            v-for="nilai in Data"
            :key="nilai.judul"
            :lapangan="nilai"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import {DataLapangan} from '~/data/lapangan';
const Data = DataLapangan
</script>