import { computed } from 'vue'
import { authService } from '~/services/auth.service'
import type { RegisterDto, LoginDto, AuthUser } from '~/types/auth'

export const useAuth = () => {
  // Token disimpan di cookie supaya tetap ada setelah halaman di-refresh
  const token = useCookie<string | null>('token', {
    maxAge: 60 * 60 * 24 * 7, // 7 hari, sama dengan masa berlaku token di backend
    sameSite: 'lax',
  })
  const user = useState<AuthUser | null>('auth-user', () => null)

  // Dianggap login selama token masih ada
  const isLoggedIn = computed(() => !!token.value)

  const register = async (form: RegisterDto) => {
    if (!form.nama.trim()) {
      throw new Error('Nama wajib diisi')
    }

    if (!form.email.trim()) {
      throw new Error('Email wajib diisi')
    }

    if (form.password.length < 8) {
      throw new Error('Password minimal 8 karakter')
    }

    if (!form.tel.trim()) {
      throw new Error('Nomor telepon wajib diisi')
    }

    return await authService.register(form)
  }

  const login = async (form: LoginDto) => {
    if (!form.email.trim()) {
      throw new Error('Email wajib diisi')
    }

    if (!form.password) {
      throw new Error('Password wajib diisi')
    }

    const response = await authService.login(form)

    if (!response.token || !response.user) {
      throw new Error('Respons login dari server tidak lengkap')
    }

    token.value = response.token
    user.value = {
      id: String(response.user.id),
      nama: response.user.nama,
      email: response.user.email,
      tel: response.user.tel,
      role: response.user.role,
    }

    return response
  }

  const logout = async () => {
    token.value = null
    user.value = null
    clearNuxtData('profile') // buang data profil user sebelumnya
    await navigateTo('/auth/login')
  }

  return {
    user,
    isLoggedIn,
    register,
    login,
    logout,
  }
}
