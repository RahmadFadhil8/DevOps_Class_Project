import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { login, me, register } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// Batasi percobaan login/daftar per IP untuk menyulitkan brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' },
})

router.post('/register', authLimiter, register)
router.post('/login', authLimiter, login)
router.get('/me', protect, me)

export default router
