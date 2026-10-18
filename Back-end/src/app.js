import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.clientUrls }))
app.use(express.json({ limit: '100kb' }))
if (!env.isProd) app.use(morgan('dev'))

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
