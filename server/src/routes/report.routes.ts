import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/rbac.middleware.js'
import { UserRole } from '../types/enums.js'
import { postReport, getReports, getReportById } from '../controllers/report.controller.js'

export const reportRouter = Router()

// Admin-only per the roadmap's placement of Reports under Phase 5.
reportRouter.use(requireAuth, requireRole(UserRole.ADMIN))
reportRouter.get('/', getReports)
reportRouter.post('/', postReport)
reportRouter.get('/:id', getReportById)
