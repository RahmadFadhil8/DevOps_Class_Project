<template>
  <section class="container mx-auto px-4 my-20">
    <div class="bg-linear-to-r from-primary to-primary/90 text-white rounded-3xl p-8 lg:p-12 shadow-2xl">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="(item, index) in stats" 
          :key="index"
          class="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-secondary/50 transition-colors"
        >
          <span class="text-3xl lg:text-4xl font-extrabold text-secondary">
            {{ item.value }}
          </span>

          <span class="text-xs font-bold text-gray-200 mt-2 uppercase tracking-wider">
            {{ item.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { value: '50+', label: 'Lapangan Terdaftar' },
  { value: '10+', label: 'Kota Tersedia' },
  { value: '10.000+', label: 'Booking Berhasil' },
  { value: '5.000+', label: 'Pengguna Aktif' }
]
</script>