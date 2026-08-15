import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { getBins, getMyBins, getBinById, getBinLevels, addWaste, postBin, patchBin } from '../controllers/bin.controller.js'
import { attachAuthIfPresent, requireAuth } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/rbac.middleware.js'
import { UserRole } from '../types/enums.js'

export const binRouter = Router()

// Public "add waste" interaction plays the role of a simulated sensor push —
// worth its own limiter so one visitor can't spam a bin to 100% instantly.
const addWasteLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
})

binRouter.get('/', attachAuthIfPresent, getBins)
// Must be registered before /:id — otherwise Express would treat "mine" as
// an :id value.
binRouter.get('/mine', requireAuth, getMyBins)
binRouter.get('/:id', getBinById)
binRouter.post('/:id/waste', addWasteLimiter, attachAuthIfPresent, addWaste)

binRouter.get('/:id/levels', requireAuth, requireRole(UserRole.STAFF, UserRole.ADMIN), getBinLevels)
binRouter.post('/', requireAuth, requireRole(UserRole.ADMIN), postBin)
binRouter.patch('/:id', requireAuth, requireRole(UserRole.ADMIN), patchBin)
