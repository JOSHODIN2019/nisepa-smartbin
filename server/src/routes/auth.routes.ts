import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { register, login, logout, me } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

export const authRouter = Router()

// Stricter limit on credential-guessing-prone endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
})

authRouter.post('/register', authLimiter, register)
authRouter.post('/login', authLimiter, login)
authRouter.post('/logout', logout)
authRouter.get('/me', requireAuth, me)
