// $fetch yang otomatis mengirim token login di header Authorization.
// Pakai ini untuk semua endpoint yang butuh login (profile, booking, favorit, dashboard).
export const useApi = () => {
  const token = useCookie<string | null>('token')

  return $fetch.create({
    headers: token.value ? { Authorization: `Bearer ${token.value}` } : {},
    onResponseError({ response }) {
      // Token habis / tidak valid -> hapus token lalu arahkan ke halaman login
      if (response.status === 401) {
        token.value = null
        navigateTo('/auth/login')
      }
    },
  })
}
