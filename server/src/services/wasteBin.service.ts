import { wasteBinRepository } from '../repositories/wasteBin.repository.js'
import { ApiError } from '../utils/ApiError.js'
import { getBinStatus } from '../types/enums.js'

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
export async function addSimulatedWaste(binId: string, amountPercent?: number) {
  const bin = await wasteBinRepository.findById(binId)
  if (!bin) throw ApiError.notFound('Bin not found')

  const addAmount = amountPercent ?? randomAddAmount()
  const newLevel = Math.min(100, Math.max(0, bin.currentLevelPercent + addAmount))

  bin.currentLevelPercent = newLevel
  bin.status = getBinStatus(newLevel)
  await bin.save()

  await wasteBinRepository.recordLevel(bin.id, newLevel)

  return bin
}
