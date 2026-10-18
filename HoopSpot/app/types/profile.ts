
export type BookingStatus =
  | 'upcoming'
  | 'completed'
  | 'cancelled'

export interface UserProfile {
  nama: string
  email: string
  telepon: string
  lokasi: string
  memberSince: string
  avatar: string
}

export interface Booking {
  id: string
  kode: string
  namaLapangan: string
  lokasi: string
  tanggal: string
  jam: string
  durasi: number
  harga: number
  status: BookingStatus
  gambar: string
}

export interface FavoriteCourt {
  id: string
  nama: string
  lokasi: string
  harga: number
  rating: number
  gambar: string
  fasilitas: string[]
}
