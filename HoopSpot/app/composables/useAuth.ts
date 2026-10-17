import { authService } from "~/services/auth.service"
import type { RegisterDto } from "~/types/auth"

export const useAuth = () => {
    const register = async (form: RegisterDto) => {
        if(!form.nama.trim()) {
            throw new Error('Nama Wajib diisi')
        }

        if(!form.email.trim()) {
            throw new Error('email Wajib diisi')
        }

        if(form.password.length < 8) {
            throw new Error('Password minimal 8 karakter')
        }

        if(!form.tel.trim()) {
            throw new Error('Nomor telepon Wajib diisi')
        }

        return await authService.register(form)
    }
    return {
        register,
    }
}