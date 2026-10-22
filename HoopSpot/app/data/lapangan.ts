import type { Lapangan } from '~/types'

import gambar1 from "~/assets/images/1.jpg"
import gambar2 from "~/assets/images/2.jpg"
import gambar3 from "~/assets/images/3.jpg"
import gambar4 from "~/assets/images/4.jpg"

export const DataLapangan: Lapangan[] = [
    {
    gambar: gambar1,
    judul: "Bali Basketball Club",
    alamat: "Canggu, Bali",
    rating: 5.0,
    harga: 300000,
    _id: "1",
    deskripsi:
      "Bali Basketball Club menawarkan pengalaman bermain basket outdoor & indoor premium di kawasan Canggu. Dengan lantai kayu (parquet) berkualitas internasional dan atmosfer tropis yang nyaman, tempat ini menjadi favorit komunitas basket lokal maupun wisatawan.",
    fasilitas: [
      "Parkir Luas",
      "Ruang Ganti & Locker",
      "Shower Air Panas",
      "Sewa Bola & Ring Tinggi Standar FIBA",
      "Kafe & Lounge"
    ]
  },
  {
    gambar: gambar2,
    judul: "Hoop Arena Jakarta",
    alamat: "Jakarta Selatan",
    rating: 4.9,
    harga: 250000,
    _id: "4",
    deskripsi:
      "Hoop Arena Jakarta hadir dengan fasilitas arena basket indoor modern ber-AC di pusat kota. Sangat cocok untuk latihan rutin, sparing komunitas 3x3 maupun 5v5, hingga event turnamen lokal.",
    fasilitas: [
      "Lantai Parquet Vynil Premium",
      "Scoreboard Digital",
      "Tribun Penonton",
      "Musala",
      "Area Food Court"
    ]
  },
  {
    gambar: gambar3,
    judul: "Court S_ide Basketball",
    alamat: "Bandung",
    rating: 4.8,
    harga: 220000,
    _id: "3",
    deskripsi:
      "Court S_ide Basketball menghadirkan lapangan basket berstandar dengan udara sejuk khas Bandung. Tempat ini dirancang _ideal bagi pemain pemula hingga profesional yang ingin mengasah skill dribble dan shooting.",
    fasilitas: [
      "Ring Basket Adjustable",
      "Penyewaan Bola & Rompi Tim",
      "Ruang Istirahat Player",
      "Kantin & Vending Machine",
      "Toilet & Ruang Ganti Bersih"
    ]
  },
  {
    gambar: gambar4,
    judul: "Surabaya Basketball Hub",
    alamat: "Surabaya",
    rating: 4.7,
    harga: 200000,
    _id: "2",
    deskripsi:
      "Surabaya Basketball Hub merupakan pusat olahraga modern di Surabaya yang menyediakan lapangan basket indoor serbaguna dengan penerangan pencahayaan LED yang terang dan nyaman untuk main malam.",
    fasilitas: [
      "Area Parkir Mobil & Motor Luas",
      "WiFi Gratis 100 Mbps",
      "Penyewaan Lapangan 3x3 & Full Court",
      "Tribun Penonton Mini"
    ]
  }
]