import { wasteBinRepository } from '../repositories/wasteBin.repository.js'
import { ApiError } from '../utils/ApiError.js'
import { getBinStatus, BinStatus } from '../types/enums.js'
import { captureSensorReading } from '../simulations/esp32.simulation.js'

// Staff/Admin see inactive bins too (they need to reactivate them); the
// public smart-bin page only ever sees active bins.
export async function listBins(includeInactive: boolean) {
  return includeInactive ? wasteBinRepository.findAll() : wasteBinRepository.findAllActive()
}

export async function getBin(id: string) {
  const bin = await wasteBinRepository.findById(id)
  if (!bin) throw ApiError.notFound('Bin not found')
  return bin
}

export async function createBin(input: { code: string; name: string; address: string; capacityLiters: number }) {
  const existing = await wasteBinRepository.findByCode(input.code)
  if (existing) throw ApiError.conflict(`A bin with code "${input.code}" already exists`, 'BIN_CODE_IN_USE')
  return wasteBinRepository.create(input)
}

export async function updateBin(
  id: string,
  input: { name?: string; address?: string; capacityLiters?: number; isActive?: boolean },
) {
  const bin = await wasteBinRepository.updateById(id, input)
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
