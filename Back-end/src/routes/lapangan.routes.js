import { Router } from 'express'
import { availability, getOne, list } from '../controllers/lapangan.controller.js'

const router = Router()

router.get('/', list)
router.get('/:id', getOne)
router.get('/:id/availability', availability)

export default router
