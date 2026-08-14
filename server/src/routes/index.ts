import { Router } from 'express'
import { sendSuccess } from '../utils/apiResponse.js'
import { authRouter } from './auth.routes.js'
import { binRouter } from './bin.routes.js'
import { notificationRouter } from './notification.routes.js'
import { issueReportRouter } from './issueReport.routes.js'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() })
})

apiRouter.use('/auth', authRouter)
apiRouter.use('/bins', binRouter)
apiRouter.use('/notifications', notificationRouter)
apiRouter.use('/issues', issueReportRouter)

// Remaining feature routers (alerts, collections, ...) are mounted here as
// each is built in later roadmap stages.
