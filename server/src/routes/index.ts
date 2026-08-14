import { Router } from 'express'
import { sendSuccess } from '../utils/apiResponse.js'

export const apiRouter = Router()

apiRouter.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() })
})

// Feature routers (auth, bins, alerts, collections, ...) are mounted here as
// each is built in later stages (07 continues in Stage 08+).
