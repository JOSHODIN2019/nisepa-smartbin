import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import { env } from './config/env.js'
import { apiRouter } from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

  // Baseline protection for auth-adjacent and mutating routes; individual
  // routers may layer stricter limits (e.g. login attempts) later.
  app.use(
    '/api',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  )

  app.use('/api', apiRouter)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
