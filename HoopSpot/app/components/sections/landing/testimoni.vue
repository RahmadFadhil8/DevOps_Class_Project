<template>
    <section class="flex flex-col gap-8 px-36 my-40 bg-gray-100">
        <div>
            <h4 class="font-bold text-center text-3xl pt-6">Apa Kata Mereka?</h4>
        </div>
        <div class="grid grid-cols-3 gap-4 pb-10 auto-rows-fr">
            <CardsTestimonialsTestimonial
            v-for="item in Data"
            :key="item.namaUser"
            :testimoni="item"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import type { Testimoni } from '~/types';
import bintang from "~/assets/icon/star.svg"

// Data dari backend. Komponen kartu memakai `rating` sebagai gambar bintang,
// jadi di sini ditambahkan ikon bintangnya.
const { data: dariApi } = await useFetch<Omit<Testimoni, 'rating'>[]>('/api/testimoni', {
    default: () => [],
})

const Data = computed<Testimoni[]>(() =>
    dariApi.value.map((item) => ({ ...item, rating: bintang }))
)
</script>