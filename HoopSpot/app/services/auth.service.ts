import type {
  RegisterDto,
  LoginDto,
  LoginResponse,
} from '~/types/auth'
import { pesanError } from '~/utils/pesanError'

// Error dari backend diubah menjadi Error biasa berisi pesan dari server,
// jadi di halaman cukup memakai error.message (contoh: "Email sudah terdaftar").
export const authService = {
  async register(form: RegisterDto) {
    try {
      return await $fetch('/api/auth/register', {
        method: 'POST',
        body: form,
      })
    } catch (error) {
      throw new Error(pesanError(error, 'Gagal mendaftar, silakan coba lagi.'))
    }
  },

  async login(form: LoginDto) {
    try {
      return await $fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: form,
      })
    } catch (error) {
      throw new Error(pesanError(error, 'Gagal login, silakan coba lagi.'))
    }
  },
}
