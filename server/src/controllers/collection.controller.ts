import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { recordCollectionSchema } from '../validators/collection.validator.js'
import { recordCollection, listCollections } from '../services/collection.service.js'
import { logActivity } from '../services/audit.service.js'

export const postCollection = asyncHandler(async (req: Request, res: Response) => {
  if (!req.auth) throw ApiError.unauthorized()
  const { notes } = recordCollectionSchema.parse(req.body ?? {})
  const { record, bin } = await recordCollection(req.params.binId as string, req.auth.userId, notes)
  await logActivity(req.auth.userId, 'collection.record', 'WasteBin', bin.id, { levelBeforeCollection: record.levelBeforeCollection })
  sendSuccess(res, { record, bin: { id: bin.id, currentLevelPercent: bin.currentLevelPercent, status: bin.status } }, 201)
})

export const getCollections = asyncHandler(async (_req: Request, res: Response) => {
  const records = await listCollections()
  sendSuccess(res, { records })
})
