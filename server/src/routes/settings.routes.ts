import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/rbac.middleware.js'
import { UserRole } from '../types/enums.js'
import { getSystemSettings, patchSystemSettings } from '../controllers/settings.controller.js'

export const settingsRouter = Router()

settingsRouter.use(requireAuth, requireRole(UserRole.ADMIN))
settingsRouter.get('/', getSystemSettings)
settingsRouter.patch('/', patchSystemSettings)
