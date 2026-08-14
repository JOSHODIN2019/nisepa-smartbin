import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { updateSettingsSchema } from '../validators/settings.validator.js'
import { getSettings, updateSettings } from '../services/settings.service.js'
import { logActivity } from '../services/audit.service.js'

export const getSystemSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getSettings()
  sendSuccess(res, { settings })
})

export const patchSystemSettings = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw ApiError.unauthorized()
  const input = updateSettingsSchema.parse(req.body)
  const settings = await updateSettings(input, req.auth.userId)
  await logActivity(req.auth.userId, 'settings.update', 'Settings', 'system', input)
  sendSuccess(res, { settings })
})
