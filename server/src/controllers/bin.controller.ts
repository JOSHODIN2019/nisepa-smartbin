import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { addWasteSchema, createBinSchema, updateBinSchema } from '../validators/bin.validator.js'
import { listBins, getBin, addSimulatedWaste, createBin, updateBin } from '../services/wasteBin.service.js'
import { UserRole } from '../types/enums.js'
import { notifyThresholdCrossed } from '../services/notification.service.js'
import { raiseThresholdAlert } from '../services/alert.service.js'
import { statusToAlertThreshold } from '../types/enums.js'
import { logActivity } from '../services/audit.service.js'
import { emitEvent } from '../realtime/eventBus.js'
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

export const getBins = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.auth?.role === UserRole.STAFF || req.auth?.role === UserRole.ADMIN
  const bins = await listBins(includeInactive)
  sendSuccess(res, { bins: bins.map(toBinDTO) })
})

export const getBinById = asyncHandler(async (req: Request, res: Response) => {
  const bin = await getBin(req.params.id as string)
  sendSuccess(res, { bin: toBinDTO(bin) })
})

export const postBin = asyncHandler(async (req: Request, res: Response) => {
  const input = createBinSchema.parse(req.body)
  const bin = await createBin(input)
  await logActivity(req.auth?.userId, 'bin.create', 'WasteBin', bin.id, { code: bin.code, name: bin.name })
  emitEvent({ type: 'bin.updated', scope: 'public', data: toBinDTO(bin) })
  sendSuccess(res, { bin: toBinDTO(bin) }, 201)
})

export const patchBin = asyncHandler(async (req: Request, res: Response) => {
  const input = updateBinSchema.parse(req.body)
  const bin = await updateBin(req.params.id as string, input)
  const action = input.isActive === false ? 'bin.deactivate' : input.isActive === true ? 'bin.reactivate' : 'bin.update'
  await logActivity(req.auth?.userId, action, 'WasteBin', bin.id, input)
  emitEvent({ type: 'bin.updated', scope: 'public', data: toBinDTO(bin) })
  sendSuccess(res, { bin: toBinDTO(bin) })
})

export const addWaste = asyncHandler(async (req: Request, res: Response) => {
  const { amountPercent } = addWasteSchema.parse(req.body ?? {})
  const { bin, thresholdCrossedInto } = await addSimulatedWaste(req.params.id as string, amountPercent)
  emitEvent({ type: 'bin.updated', scope: 'public', data: toBinDTO(bin) })

  if (thresholdCrossedInto) {
    const threshold = statusToAlertThreshold(thresholdCrossedInto)
    if (threshold) {
      const alert = await raiseThresholdAlert(bin.id, bin.name, threshold, thresholdCrossedInto)
      emitEvent({ type: 'alert.created', scope: 'staff', data: { alertId: alert.id, binId: bin.id, binName: bin.name } })
    }
    // The acting user also gets a personal confirmation — separate from the
    // staff/admin-facing Alert created above.
    if (req.auth) {
      await notifyThresholdCrossed(req.auth.userId, bin.id, bin.name, thresholdCrossedInto)
    }
  }

  sendSuccess(res, { bin: toBinDTO(bin) })
})
