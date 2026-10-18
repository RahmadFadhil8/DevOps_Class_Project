export interface RegisterDto {
  nama: string
  email: string
  tel: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  nama: string
  email: string
  tel?: string
}

export interface LoginResponse {
  user: AuthUser
  message?: string
  token?: string
}