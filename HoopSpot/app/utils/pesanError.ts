// Mengambil pesan error dari backend ({ "message": "..." }).
// Contoh: "Email sudah terdaftar", "Slot ini sudah dipesan".
export const pesanError = (
  error: any,
  cadangan = 'Terjadi kesalahan, silakan coba lagi.',
): string => error?.data?.message || cadangan
