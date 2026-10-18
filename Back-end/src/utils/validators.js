import { z } from 'zod'
import { isValidTanggal } from './time.js'

export const objectId = z
  .string({ error: 'ID wajib diisi' })
  .regex(/^[a-f\d]{24}$/i, 'ID tidak valid')

export const idParam = z.object({ id: objectId })

export const tanggalSchema = z
  .string({ error: 'Tanggal wajib diisi' })
  .refine(isValidTanggal, 'Tanggal harus berformat YYYY-MM-DD')

export const jamSchema = z
  .string({ error: 'Jam wajib diisi' })
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Jam harus berformat HH:mm')

export const emailSchema = z
  .string({ error: 'Email wajib diisi' })
  .trim()
  .toLowerCase()
  .pipe(z.email('Format email tidak valid'))

/** Angka opsional dari query string; string kosong dianggap tidak diisi. */
export const optionalInt = z.preprocess(
  (v) => (v === '' || v === undefined ? undefined : v),
  z.coerce.number('Harus berupa angka').int('Harus berupa bilangan bulat').min(0).optional(),
)

export const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
