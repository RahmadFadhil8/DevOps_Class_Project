import type { RegisterDto } from "~/types/auth"

export const authService = {
    register(form: RegisterDto) {
        return $fetch('/api/auth/register', {
            method: 'POST',
            body: form
        })
    }
}