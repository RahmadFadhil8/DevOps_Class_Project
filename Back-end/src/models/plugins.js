/**
 * Ubah output JSON: `_id` -> `id` (string), buang `__v` dan `password`.
 * Supaya response cocok dengan type frontend (`id`, bukan `_id`).
 */
export function normalizeJSON(schema) {
  schema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = String(ret._id)
      delete ret._id
      delete ret.password
      return ret
    },
  })
}
