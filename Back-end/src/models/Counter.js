import mongoose from 'mongoose'

// Penghitung berurutan yang aman dari race condition (dipakai untuk kode booking)
const counterSchema = new mongoose.Schema(
  { _id: String, seq: { type: Number, default: 0 } },
  { collection: 'counters' },
)

export const Counter = mongoose.model('Counter', counterSchema)

export async function nextSeq(key) {
  const counter = await Counter.findOneAndUpdate(
    { _id: key },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' },
  )
  return counter.seq
}
