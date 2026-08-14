import { wasteBinRepository } from '../repositories/wasteBin.repository.js'
import { ApiError } from '../utils/ApiError.js'
import { getBinStatus, BinStatus } from '../types/enums.js'

const MIN_SIMULATED_ADD_PERCENT = 5
const MAX_SIMULATED_ADD_PERCENT = 15

function randomAddAmount(): number {
  return Math.round(
    MIN_SIMULATED_ADD_PERCENT + Math.random() * (MAX_SIMULATED_ADD_PERCENT - MIN_SIMULATED_ADD_PERCENT),
  )
}

export async function listBins() {
  return wasteBinRepository.findAllActive()
}

export async function getBin(id: string) {
  const bin = await wasteBinRepository.findById(id)
  if (!bin) throw ApiError.notFound('Bin not found')
  return bin
}

// Simulated IoT sensor boundary: a real ESP32 + ultrasonic sensor would push a
// level reading; here a public "add waste" interaction plays that role. See
// PROJECT_MEMORY.md Section 5.1 (IoT Hardware simulation policy).
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
  const addAmount = amountPercent ?? randomAddAmount()
  const newLevel = Math.min(100, Math.max(0, bin.currentLevelPercent + addAmount))
  const newStatus = getBinStatus(newLevel)

  bin.currentLevelPercent = newLevel
  bin.status = newStatus
  await bin.save()

  await wasteBinRepository.recordLevel(bin.id, newLevel)

  const thresholdCrossedInto = newStatus !== previousStatus && newStatus !== BinStatus.NORMAL ? newStatus : null

  return { bin, thresholdCrossedInto }
}
