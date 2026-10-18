import { Router } from 'express'
import { cancel, create, getOne, mine, pay } from '../controllers/booking.controller.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect) // semua endpoint booking wajib login

router.post('/', create)
router.get('/saya', mine) // harus di atas '/:id'
router.get('/:id', getOne)
router.post('/:id/bayar', pay)
router.patch('/:id/batal', cancel)

export default router
