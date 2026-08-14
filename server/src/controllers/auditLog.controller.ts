import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { listActivity } from '../services/audit.service.js'

export const getActivity = asyncHandler(async (_req: Request, res: Response) => {
  const logs = await listActivity()
  sendSuccess(res, { logs })
})
