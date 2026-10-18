export const ROLE = { USER: 'user', ADMIN: 'admin' }

export const BOOKING_STATUS = {
  PENDING: 'Pending', // dibuat, menunggu pembayaran (slot ditahan sementara)
  APPROVED: 'Approved', // sudah dibayar / dikonfirmasi
  REJECTED: 'Rejected', // ditolak admin
  CANCELLED: 'Cancelled', // dibatalkan user
  EXPIRED: 'Expired', // tidak dibayar sampai batas waktu
}

// Status yang "memakai" slot. Status lain berarti slot kembali kosong.
export const ACTIVE_STATUSES = [BOOKING_STATUS.PENDING, BOOKING_STATUS.APPROVED]

export const PAYMENT_STATUS = { UNPAID: 'Unpaid', PAID: 'Paid', REFUNDED: 'Refunded' }
export const PAYMENT_METHODS = ['QRIS']

export const COURT_TYPES = ['Indoor', 'Outdoor']

// Samakan dengan app/data/booking.ts di frontend
export const DURATIONS = [60, 90, 120]
export const SLOT_STARTS = ['07:00', '08:30', '10:00', '11:30', '15:00', '16:30']

export const SERVICE_FEE = 5000 // Rp 5.000, sama seperti di halaman pembayaran
export const HOLD_MINUTES = 15 // batas waktu bayar sebelum slot dilepas
export const MIN_CANCEL_HOURS = 24 // sesuai FAQ: batal minimal 24 jam sebelum main
export const MAX_ADVANCE_DAYS = 60 // maksimal booking berapa hari ke depan

// Semua jam dianggap WIB (Asia/Jakarta)
export const TIMEZONE = 'Asia/Jakarta'
export const TZ_OFFSET = '+07:00'
