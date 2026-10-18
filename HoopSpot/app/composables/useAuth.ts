
import { computed } from 'vue'
import { authService } from '~/services/auth.service'
import type { RegisterDto, LoginDto, AuthUser } from '~/types/auth'

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth-user', () => null)

  const isLoggedIn = computed(() => user.value !== null)

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
    const userData = response.user

    if (!userData) {
      throw new Error('Data pengguna tidak ditemukan dari respons login')
    }

    user.value = {
      id: String(userData.id),
      nama: userData.nama,
      email: userData.email,
      tel: userData.tel,
    }

    return response
  }

  const logout = () => {
    user.value = null
  }

  return {
    user,
    isLoggedIn,
    register,
    login,
    logout,
  }
}
