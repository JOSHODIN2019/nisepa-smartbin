import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { attachAuthIfPresent, requireAuth } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/rbac.middleware.js'
import { UserRole } from '../types/enums.js'
import { createIssueReport, getIssueReports, getIssueReportStats } from '../controllers/issueReport.controller.js'

export const issueReportRouter = Router()

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
})

// Reporting is open to anonymous visitors too (Section 6.1) — attachAuthIfPresent
// links the report to a user account when one is logged in, without requiring it.
issueReportRouter.post('/', submitLimiter, attachAuthIfPresent, createIssueReport)

issueReportRouter.get('/', requireAuth, requireRole(UserRole.STAFF, UserRole.ADMIN), getIssueReports)
issueReportRouter.get('/stats', requireAuth, requireRole(UserRole.STAFF, UserRole.ADMIN), getIssueReportStats)
