import type { UserProfile } from '~/types/profile'
import { useApi } from './useApi'

// Mengambil data profil user yang sedang login dari backend.
// Key 'profile' sama di semua halaman, jadi datanya dipakai bersama (tidak fetch berulang).
export const useProfile = async () => {
  const api = useApi()

  const { data, refresh } = await useAsyncData('profile', () =>
    api<UserProfile>('/api/profile'),
  )

  // Nilai kosong sebagai cadangan supaya template tidak error saat data belum ada
  const user = computed<UserProfile>(
    () =>
      data.value ?? {
        nama: '',
        email: '',
        telepon: '',
        lokasi: '',
        memberSince: '',
        avatar: '',
      },
  )

  return { user, refresh }
}
