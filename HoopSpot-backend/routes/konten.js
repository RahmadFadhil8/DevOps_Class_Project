const express = require('express')
const Testimoni = require('../models/Testimoni')
const Faq = require('../models/Faq')

const router = express.Router()

// GET /api/testimoni
router.get('/testimoni', async (req, res) => {
  res.json(await Testimoni.find().sort({ urutan: 1 }))
})

// GET /api/faq
router.get('/faq', async (req, res) => {
  res.json(await Faq.find().sort({ urutan: 1 }))
})

module.exports = router
