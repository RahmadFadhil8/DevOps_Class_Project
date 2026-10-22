// export default defineNuxtPlugin(async () => {
//   const { fetchUser } = useAuth()
  
//   // Ambil data user dari backend berdasarkan token di localStorage saat aplikasi pertama kali dimuat di client
//   if (import.meta.client) {
//     await fetchUser()
//   }
// })