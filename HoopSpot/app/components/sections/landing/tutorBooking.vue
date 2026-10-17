<template>
  <section class="px-36 my-40 bg-slate-50/50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header Section -->
      <div class="max-w-2xl mx-auto text-center flex flex-col gap-4 mb-16">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
          Mulai Bermain Tanpa Ribet
        </h2>
        <p class="text-base sm:text-lg text-gray-600">
          Temukan lapangan favorit Anda, pilih jadwal yang tersedia, dan selesaikan booking hanya dalam hitungan menit.
        </p>
      </div>

      <!-- Steps Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group"
        >
          <!-- Nomor Badge Kecil di Pojok (Opsional untuk kesan modern) -->
          <span class="absolute top-4 right-4 text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            0{{ index + 1 }}
          </span>

          <!-- Icon Box -->
          <div class="h-20 w-20 p-4 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <img :src="step.icon" alt="icon" class="h-10 w-10 text-secondary">
          </div>

          <!-- Judul & Deskripsi -->
          <h3 class="font-bold text-xl text-primary mb-2">
            {{ step.title }}
          </h3>
          <p class="text-sm text-gray-500 leading-relaxed">
            klaim dan nikmati kemudahan dalam <span v-html="step.description"></span>
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
// Mengimpor icon dari direktori asetmu
import searchIcon from '~/assets/icon/search.svg'
import calendarIcon from '~/assets/icon/calendar.svg'
import stadiumIcon from '~/assets/icon/stadium.svg'

const steps = [
  {
    icon: searchIcon,
    title: '1. Cari Lapangan',
    description: 'Cari lokasi lapangan Basket terdekat atau berdasarkan preferensi kota Anda.'
  },
  {
    icon: calendarIcon,
    title: '2. Pilih Jadwal',
    description: 'Pilih jam tayang yang tersedia secara real-time. Tidak perlu telepon satu per satu.'
  },
  {
    icon: stadiumIcon,
    title: '3. Booking & Main',
    description: 'Bayar dengan aman secara online dan nikmati permainan Anda di lapangan.'
  }
]
</script>