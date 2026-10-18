import { Router } from 'express'
import { listFaq, listTestimoni } from '../controllers/content.controller.js'

export const testimoniRoutes = Router().get('/', listTestimoni)
export const faqRoutes = Router().get('/', listFaq)
