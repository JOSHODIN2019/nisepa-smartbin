import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { getBins, getBinById, addWaste } from '../controllers/bin.controller.js'

export const binRouter = Router()

// Public "add waste" interaction plays the role of a simulated sensor push —
// worth its own limiter so one visitor can't spam a bin to 100% instantly.
const addWasteLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
})

binRouter.get('/', getBins)
binRouter.get('/:id', getBinById)
binRouter.post('/:id/waste', addWasteLimiter, addWaste)
