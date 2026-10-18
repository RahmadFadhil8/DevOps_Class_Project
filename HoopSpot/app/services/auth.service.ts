
import type {
  RegisterDto,
  LoginDto,
  LoginResponse,
} from '~/types/auth'

export const authService = {
  register(form: RegisterDto) {
    return $fetch('/api/auth/register', {
      method: 'POST',
      body: form,
    })
  },

  login(form: LoginDto) {
    return $fetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: form,
    })
  },
}
