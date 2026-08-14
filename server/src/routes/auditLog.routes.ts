import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/rbac.middleware.js'
import { UserRole } from '../types/enums.js'
import { getActivity } from '../controllers/auditLog.controller.js'

export const auditLogRouter = Router()

auditLogRouter.use(requireAuth, requireRole(UserRole.ADMIN))
auditLogRouter.get('/', getActivity)
