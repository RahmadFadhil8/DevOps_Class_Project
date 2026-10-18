import { Router } from 'express'
import mongoose from 'mongoose'
import authRoutes from './auth.routes.js'
import lapanganRoutes from './lapangan.routes.js'
import bookingRoutes from './booking.routes.js'
import adminRoutes from './admin.routes.js'
import { faqRoutes, testimoniRoutes } from './content.routes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
  })
})

router.use('/auth', authRoutes)
router.use('/lapangan', lapanganRoutes)
router.use('/booking', bookingRoutes)
router.use('/testimoni', testimoniRoutes)
router.use('/faq', faqRoutes)
router.use('/admin', adminRoutes)

export default router
