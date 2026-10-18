
import type {
  UserProfile,
  Booking,
  FavoriteCourt,
} from '~/types/profile'

export const profileUser: UserProfile = {
  nama: 'Rahmad Fadhil',
  email: 'rahmad@example.com',
  telepon: '081234567890',
  lokasi: 'Medan, Sumatera Utara',
  memberSince: 'September 2026',
  avatar: '',
}

export const bookingData: Booking[] = [
  {
    id: '1',
    kode: 'HPS-2026-001',
    namaLapangan: 'Hoop Arena',
    lokasi: 'Medan Petisah, Medan',
    tanggal: '2026-10-22',
    jam: '16:00 - 18:00',
    durasi: 2,
    harga: 300000,
    status: 'upcoming',
    gambar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    kode: 'HPS-2026-002',
    namaLapangan: 'Basket Center',
    lokasi: 'Medan Sunggal, Medan',
    tanggal: '2026-10-12',
    jam: '19:00 - 20:00',
    durasi: 1,
    harga: 150000,
    status: 'completed',
    gambar: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    kode: 'HPS-2026-003',
    namaLapangan: 'Victory Basketball',
    lokasi: 'Medan Timur, Medan',
    tanggal: '2026-10-05',
    jam: '14:00 - 16:00',
    durasi: 2,
    harga: 250000,
    status: 'cancelled',
    gambar: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80',
  },
]

export const favoriteData: FavoriteCourt[] = [
  {
    id: '1',
    nama: 'Hoop Arena',
    lokasi: 'Medan Petisah, Medan',
    harga: 150000,
    rating: 4.8,
    gambar: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
    fasilitas: ['Indoor', 'Ruang ganti', 'Parkir'],
  },
  {
    id: '2',
    nama: 'Basket Center',
    lokasi: 'Medan Sunggal, Medan',
    harga: 125000,
    rating: 4.7,
    gambar: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=900&q=80',
    fasilitas: ['Indoor', 'Toilet', 'Parkir'],
  },
  {
    id: '3',
    nama: 'Victory Basketball',
    lokasi: 'Medan Timur, Medan',
    harga: 175000,
    rating: 4.9,
    gambar: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=900&q=80',
    fasilitas: ['Outdoor', 'Tribun', 'Parkir'],
  },
]
