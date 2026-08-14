import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/rbac.middleware.js'
import { UserRole } from '../types/enums.js'
import { getAlerts, acknowledge, resolve } from '../controllers/alert.controller.js'

export const alertRouter = Router()

alertRouter.use(requireAuth, requireRole(UserRole.STAFF, UserRole.ADMIN))
alertRouter.get('/', getAlerts)
alertRouter.patch('/:id/acknowledge', acknowledge)
alertRouter.patch('/:id/resolve', resolve)
