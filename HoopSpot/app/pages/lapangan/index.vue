<template>
    <section class="px-36">
        <div class="pt-28 mb-4">
            <h1 class="font-bold text-4xl mb-2">Cari Lapangan</h1>
            <p class="text-lg">Temukan lapangan Basket terbaik disekitarmu dengan harga kompetitif.</p>
        </div>
        <div class="mb-10">
            <CardsCourtTablefilter/>
            <div class="grid grid-cols-4 gap-4 mt-6">
                <CardsCourtProduct
                v-for="nilai in Data"
                :key="nilai.judul"
                :lapangan="nilai"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {DataLapangan} from '~/data/lapangan';
const Data = DataLapangan
</script>