// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Semua request ke /api/... di frontend diteruskan ke server Express (port 4000).
  // Jadi $fetch('/api/auth/login') yang sudah ada di kodemu langsung jalan, tanpa urusan CORS.
  routeRules: {
    '/api/**': { proxy: 'http://127.0.0.1:4000/api/**' },
  },
})
