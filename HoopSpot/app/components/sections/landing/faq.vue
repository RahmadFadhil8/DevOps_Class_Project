<template>
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 my-24 scroll-mt-28" id="faq">
        <div class="flex flex-col items-center justify-center gap-10">
            <!-- Header Section -->
            <div class="text-center max-w-xl">
                <h2 class="font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
                    Pertanyaan Populer
                </h2>
                <p class="text-gray-500 mt-3 text-sm sm:text-base">
                    Punya pertanyaan seputar cara booking atau penggunaan platform HoopSpot? Temukan jawabannya di sini.
                </p>
            </div>

            <!-- FAQ List Container -->
            <div class="w-full max-w-3xl flex flex-col gap-4">
                <div 
                    v-for="(faq, index) in DataFaq" 
                    :key="index" 
                    class="border rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-300 border-gray-200 hover:border-primary/30"
                >
                    <button 
                        @click="TombolFAQ(index)" 
                        class="flex justify-between items-center w-full px-6 py-5 cursor-pointer text-left focus:outline-none"
                    >
                        <h3 class="font-semibold text-base sm:text-lg text-primary pr-4">
                            {{ faq.pertanyaan }}
                        </h3>
                        <div class="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                            <img 
                                src="~/assets/icon/faq.svg" 
                                class="transition-transform duration-300 h-5 w-5"
                                :class="indexActive === index ? 'rotate-180 filter-primary' : ''" 
                                alt="icon"
                            >
                        </div>
                    </button>

                    <!-- Animasi Dropdown & Konten Jawaban -->
                    <div v-show="indexActive === index" class="px-6 pb-5 pt-0 animate-fade-in">
                        <p class="text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-4">
                            {{ faq.jawaban }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.25s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import type { Faq } from '~/types';

const indexActive = ref<number | null>(null);

const DataFaq = ref<Faq[]>([
    {
        pertanyaan: "Bagaimana cara melakukan booking lapangan?",
        jawaban: "Cukup pilih lapangan basket yang Anda inginkan, tentukan tanggal dan jam tayang, pilih metode pembayaran, dan selesaikan transaksi. Setelah berhasil, Anda akan menerima kode booking melalui email dan aplikasi."
    },
    {
        pertanyaan: "Metode pembayaran apa saja yang tersedia?",
        jawaban: "Kami mendukung berbagai metode pembayaran mulai dari Virtual Account (BCA, Mandiri, BNI), E-Wallet (GoPay, OVO, DANA), hingga kartu kredit."
    },
    {
        pertanyaan: "Apakah saya bisa membatalkan jadwal booking?",
        jawaban: "Ya, pembatalan dapat dilakukan minimal 24 jam sebelum jadwal pertandingan dimulai. Dana akan dikembalikan ke saldo akun HoopSpot atau rekening asal sesuai dengan kebijakan pengelola lapangan."
    },
    {
        pertanyaan: "Berapa jam operasional layanan HoopSpot?",
        jawaban: "Platform website dan sistem booking online kami dapat diakses 24/7. Untuk jam operasional fisik masing-masing lapangan basket bervariasi, namun umumnya buka mulai pukul 06:00 hingga 23:00 WIB."
    },
])

const TombolFAQ = (index: number) => {
    indexActive.value = indexActive.value === index ? null : index;
}
</script>