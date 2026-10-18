import { Testimoni } from '../models/Testimoni.js'
import { Faq } from '../models/Faq.js'

export const listTestimoni = async (req, res) => {
  res.json(await Testimoni.find({ isActive: true }).sort({ urutan: 1 }))
}

export const listFaq = async (req, res) => {
  res.json(await Faq.find({ isActive: true }).sort({ urutan: 1 }))
}
