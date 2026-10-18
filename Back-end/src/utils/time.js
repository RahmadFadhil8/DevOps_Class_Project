import { TIMEZONE, TZ_OFFSET } from '../config/constants.js'

export const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export const toHHmm = (minutes) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

export const addMinutes = (hhmm, add) => toHHmm(toMinutes(hhmm) + add)

/** Gabungkan tanggal 'YYYY-MM-DD' + jam 'HH:mm' (WIB) menjadi objek Date. */
export const toDate = (tanggal, hhmm = '00:00') => new Date(`${tanggal}T${hhmm}:00${TZ_OFFSET}`)

/** Tanggal hari ini di WIB, format 'YYYY-MM-DD'. */
export const todayWIB = (now = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: TIMEZONE }).format(now)

/** Format tanggal 'YYYY-MM-DD' yang valid secara kalender (menolak 2026-02-31). */
export const isValidTanggal = (tanggal) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) return false
  const d = new Date(`${tanggal}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === tanggal
}

/** Geser tanggal 'YYYY-MM-DD' sebanyak n hari. */
export const addDays = (tanggal, n) => {
  const d = new Date(`${tanggal}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Jam sekarang di WIB dalam menit sejak 00:00. */
export const nowMinutesWIB = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)
  const h = Number(parts.find((p) => p.type === 'hour').value) % 24
  const m = Number(parts.find((p) => p.type === 'minute').value)
  return h * 60 + m
}
