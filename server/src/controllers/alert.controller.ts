import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { listAlerts, acknowledgeAlert, resolveAlert } from '../services/alert.service.js'
import { logActivity } from '../services/audit.service.js'

export const getAlerts = asyncHandler(async (_req: Request, res: Response) => {
  const alerts = await listAlerts()
  sendSuccess(res, { alerts })
})

export const acknowledge = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw ApiError.unauthorized()
  const alert = await acknowledgeAlert(req.params.id as string, req.auth.userId)
  await logActivity(req.auth.userId, 'alert.acknowledge', 'Alert', alert.id)
  sendSuccess(res, { alert })
})

export const resolve = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw ApiError.unauthorized()
  const alert = await resolveAlert(req.params.id as string)
  await logActivity(req.auth.userId, 'alert.resolve', 'Alert', alert.id)
  sendSuccess(res, { alert })
})
