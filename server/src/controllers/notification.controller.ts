import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { listNotifications, markNotificationRead } from '../services/notification.service.js'

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw ApiError.unauthorized()
  const notifications = await listNotifications(req.auth.userId)
  sendSuccess(res, { notifications })
})

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw ApiError.unauthorized()
  const notification = await markNotificationRead(req.params.id as string, req.auth.userId)
  sendSuccess(res, { notification })
})
