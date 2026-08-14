import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { addWasteSchema } from '../validators/bin.validator.js'
import { listBins, getBin, addSimulatedWaste } from '../services/wasteBin.service.js'
import { notifyThresholdCrossed } from '../services/notification.service.js'
import type { WasteBinDoc } from '../models/WasteBin.js'
import type { HydratedDocument } from 'mongoose'

function toBinDTO(bin: HydratedDocument<WasteBinDoc>) {
  return {
    id: bin.id,
    code: bin.code,
    name: bin.name,
    location: bin.location,
    capacityLiters: bin.capacityLiters,
    currentLevelPercent: bin.currentLevelPercent,
    status: bin.status,
    isActive: bin.isActive,
    lastCollectedAt: bin.lastCollectedAt,
    updatedAt: bin.updatedAt,
  }
}

export const getBins = asyncHandler(async (_req: Request, res: Response) => {
  const bins = await listBins()
  sendSuccess(res, { bins: bins.map(toBinDTO) })
})

export const getBinById = asyncHandler(async (req: Request, res: Response) => {
  const bin = await getBin(req.params.id as string)
  sendSuccess(res, { bin: toBinDTO(bin) })
})

export const addWaste = asyncHandler(async (req: Request, res: Response) => {
  const { amountPercent } = addWasteSchema.parse(req.body ?? {})
  const { bin, thresholdCrossedInto } = await addSimulatedWaste(req.params.id as string, amountPercent)

  // Only the user who triggered the crossing is notified here — this is not
  // an alert to NISEPA staff/admin (that's the not-yet-built Alert Engine).
  if (req.auth && thresholdCrossedInto) {
    await notifyThresholdCrossed(req.auth.userId, bin.id, bin.name, thresholdCrossedInto)
  }

  sendSuccess(res, { bin: toBinDTO(bin) })
})
