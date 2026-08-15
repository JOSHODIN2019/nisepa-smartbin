import { wasteBinRepository } from '../repositories/wasteBin.repository.js'
import { userRepository } from '../repositories/user.repository.js'
import { ApiError } from '../utils/ApiError.js'
import { getBinStatus, BinStatus, BinLocationType, UserRole } from '../types/enums.js'
import { captureSensorReading } from '../simulations/esp32.simulation.js'

// Staff/Admin see inactive bins too (they need to reactivate them); the
// public smart-bin page only ever sees active bins.
export async function listBins(includeInactive: boolean) {
  return includeInactive ? wasteBinRepository.findAll() : wasteBinRepository.findAllActive()
}

// A public resident's own dashboard — only the house bin(s) assigned to
// them, never the shared roadside network (that's what /smart-bin is for).
export async function listBinsForUser(userId: string) {
  return wasteBinRepository.findAssignedToUser(userId)
}

export async function getBin(id: string) {
  const bin = await wasteBinRepository.findById(id)
  if (!bin) throw ApiError.notFound('Bin not found')
  return bin
}

export async function getBinLevelHistory(id: string) {
  await getBin(id) // 404s if the bin doesn't exist, rather than silently returning []
  return wasteBinRepository.recentLevels(id)
}

// A house bin's assignedUserId must reference an active public-role user —
// never trust a client-supplied ID blindly, and never let a roadside bin
// carry a leftover assignment from before it was switched.
async function resolveAssignedUserId(
  locationType: BinLocationType,
  assignedUserId: string | null | undefined,
): Promise<string | null> {
  if (locationType === BinLocationType.ROADSIDE) return null
  if (!assignedUserId) return null

  const user = await userRepository.findById(assignedUserId)
  if (!user || user.role !== UserRole.PUBLIC || !user.isActive) {
    throw ApiError.badRequest('assignedUserId must reference an active public-role user', 'INVALID_BIN_ASSIGNMENT')
  }
  return assignedUserId
}

export async function createBin(input: {
  code: string
  name: string
  address: string
  capacityLiters: number
  locationType?: BinLocationType
  assignedUserId?: string
}) {
  const existing = await wasteBinRepository.findByCode(input.code)
  if (existing) throw ApiError.conflict(`A bin with code "${input.code}" already exists`, 'BIN_CODE_IN_USE')

  const locationType = input.locationType ?? BinLocationType.ROADSIDE
  const assignedUserId = await resolveAssignedUserId(locationType, input.assignedUserId)
  return wasteBinRepository.create({ ...input, locationType, assignedUserId })
}

export async function updateBin(
  id: string,
  input: {
    name?: string
    address?: string
    capacityLiters?: number
    isActive?: boolean
    locationType?: BinLocationType
    assignedUserId?: string | null
  },
) {
  const existing = await wasteBinRepository.findById(id)
  if (!existing) throw ApiError.notFound('Bin not found')

  const update: typeof input = { ...input }
  if (input.locationType !== undefined || input.assignedUserId !== undefined) {
    const locationType = input.locationType ?? (existing.locationType as BinLocationType)
    const requestedAssignedUserId = input.assignedUserId !== undefined ? input.assignedUserId : existing.assignedUserId?.toString()
    update.assignedUserId = await resolveAssignedUserId(locationType, requestedAssignedUserId)
  }

  const bin = await wasteBinRepository.updateById(id, update)
  if (!bin) throw ApiError.notFound('Bin not found')
  return bin
}

// The IoT Data API boundary (Stage 24): a real ESP32 + ultrasonic sensor
// would POST a level reading here; a public "add waste" interaction plays
// that role for the simulation. `amountPercent`, when omitted, is sourced
// from the simulated ESP32/sensor chain (Stages 22-23) rather than computed
// inline — this function shouldn't need to know how a reading was produced,
// only what to do with one. See PROJECT_MEMORY.md Section 5.1.
//
// Returns the crossed-into status only when the update pushed the bin into a
// *worse* tier than it was in before (never on a same-tier update) — the
// caller uses this to decide whether a threshold notification is warranted,
// mirroring the "avoid duplicate alerts for the same crossing" rule in
// Section 7.
export async function addSimulatedWaste(binId: string, amountPercent?: number) {
  const bin = await wasteBinRepository.findById(binId)
  if (!bin) throw ApiError.notFound('Bin not found')

  const previousStatus = bin.status as BinStatus
  const addAmount = amountPercent ?? (await captureSensorReading())
  const newLevel = Math.min(100, Math.max(0, bin.currentLevelPercent + addAmount))
  const newStatus = getBinStatus(newLevel)

  bin.currentLevelPercent = newLevel
  bin.status = newStatus
  await bin.save()

  await wasteBinRepository.recordLevel(bin.id, newLevel)

  const thresholdCrossedInto = newStatus !== previousStatus && newStatus !== BinStatus.NORMAL ? newStatus : null

  return { bin, thresholdCrossedInto }
}
