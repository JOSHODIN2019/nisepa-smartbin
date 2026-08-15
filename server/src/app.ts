import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import { env } from './config/env.js'
import { apiRouter } from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  // Stage 59 — standard security headers (X-Content-Type-Options,
  // X-Frame-Options, a strict default CSP, etc.). This server only ever
  // returns JSON or an SSE stream, never HTML it renders itself, so
  // Helmet's defaults are safe as-is with no per-route CSP tuning needed.
  app.use(helmet())
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
