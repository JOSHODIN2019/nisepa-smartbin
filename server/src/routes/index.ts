import { Router } from 'express'
import { sendSuccess } from '../utils/apiResponse.js'
import { authRouter } from './auth.routes.js'
import { binRouter } from './bin.routes.js'
import { notificationRouter } from './notification.routes.js'
import { issueReportRouter } from './issueReport.routes.js'
import { alertRouter } from './alert.routes.js'
import { userRouter } from './user.routes.js'
import { collectionRouter } from './collection.routes.js'
import { reportRouter } from './report.routes.js'
import { auditLogRouter } from './auditLog.routes.js'
import { settingsRouter } from './settings.routes.js'
import { eventsRouter } from './events.routes.js'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/bins', binRouter)
apiRouter.use('/notifications', notificationRouter)
apiRouter.use('/issues', issueReportRouter)
apiRouter.use('/alerts', alertRouter)
apiRouter.use('/users', userRouter)
apiRouter.use('/collections', collectionRouter)
apiRouter.use('/reports', reportRouter)
apiRouter.use('/activity', auditLogRouter)
apiRouter.use('/settings', settingsRouter)
apiRouter.use('/events', eventsRouter)
