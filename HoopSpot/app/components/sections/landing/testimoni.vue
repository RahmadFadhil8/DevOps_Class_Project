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
import gambar1 from "~/assets/images/pofil (1).jpg"
import gambar2 from "~/assets/images/pofil (2).jpg"
import gambar3 from "~/assets/images/pofil (3).jpg"
import bintang from "~/assets/icon/star.svg"

const Data: Testimoni[] = [
    {
        profil:gambar1,
        namaUser:"Andi Pratama",
        testimo:"Proses booking sangat cepat! Saya tidak perlu lagi chat satu per satu admin lapangan untuk tanya jadwal kosong.",
        rating:bintang
    },
    {
        profil:gambar2,
        namaUser:"Siska Wijaya",
        testimo:"Fitur pembayaran online-nya memudahkan kami sebagai komunitas. Langsung beres dan tinggal main!",
        rating:bintang,
    },
    {
        profil:gambar3,
        namaUser:"Budi Santoso",
        testimo:"Aplikasi paling informatif untuk cari lapangan Basket di Jakarta. Rating-nya jujur dan fotonya akurat",
        rating:bintang,
    },
]
</script>