<template>
    <section class="px-36">
        <div class="pt-28 mb-4">
            <nav class="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <NuxtLink to="/" class="hover:text-primary">Beranda</NuxtLink>
                <span>/</span>
                <span class="text-slate-800">Lapangan</span>
            </nav>
            <h1 class="font-bold text-4xl mb-2">Cari Lapangan</h1>
            <p class="text-lg">Temukan lapangan Basket terbaik disekitarmu dengan harga kompetitif.</p>
        </div>
        <div class="mb-10">
            <CardsCourtTablefilter @cari="cari"/>
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
import type { Lapangan } from '~/types'

// Filter pencarian. Setiap kali isinya berubah, useFetch otomatis mengambil data lagi.
const filter = reactive({ q: '', tipe: '', hargaMin: '', hargaMax: '' })

const { data: Data } = await useFetch<Lapangan[]>('/api/lapangan', {
    query: filter,
    default: () => [],
})

const cari = (hasil: typeof filter) => {
    Object.assign(filter, hasil)
}
</script>