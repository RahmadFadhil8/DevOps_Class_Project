// Halaman yang butuh login. Pasang dengan: definePageMeta({ middleware: 'auth' })
export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('token')
  if (!token.value) {
    return navigateTo('/auth/login')
  }
})
