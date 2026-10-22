// Supaya response JSON memakai `id` (bukan `_id`) dan tanpa `__v`, sesuai type di frontend
module.exports = function ubahJSON(schema) {
  schema.set('toJSON', {
    versionKey: false,
    transform: (doc, ret) => {
      ret.id = String(ret._id)
      delete ret._id
    },
  })
}
