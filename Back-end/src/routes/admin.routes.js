import { Router } from 'express'
import { protect, restrictTo } from '../middleware/auth.js'
import { ROLE } from '../config/constants.js'
import {
  courtStatus,
  listBookings,
  stats,
  updateBookingStatus,
} from '../controllers/admin.controller.js'
import { create, remove, update } from '../controllers/lapangan.controller.js'

const router = Router()

router.use(protect, restrictTo(ROLE.ADMIN)) // semua endpoint admin

router.get('/stats', stats)

router.get('/booking', listBookings)
router.patch('/booking/:id/status', updateBookingStatus)

router.get('/lapangan/status', courtStatus) // harus di atas '/lapangan/:id'
router.post('/lapangan', create)
router.patch('/lapangan/:id', update)
router.delete('/lapangan/:id', remove)

export default router
