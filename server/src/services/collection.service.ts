import { collectionRecordRepository } from '../repositories/collectionRecord.repository.js'
import { wasteBinRepository } from '../repositories/wasteBin.repository.js'
import { alertRepository } from '../repositories/alert.repository.js'
import { ApiError } from '../utils/ApiError.js'
import { BinStatus } from '../types/enums.js'

// Completes the core system loop (PROJECT_MEMORY.md Section 1.2): staff
// collects a bin -> its level resets and any outstanding alerts for it are
// resolved, since the reason for them no longer exists.
export async function recordCollection(binId: string, staffId: string, notes: string | undefined) {
  const bin = await wasteBinRepository.findById(binId)
  if (!bin) throw ApiError.notFound('Bin not found')

  const record = await collectionRecordRepository.create({
    binId,
    staffId,
    levelBeforeCollection: bin.currentLevelPercent,
    notes,
  })

  bin.currentLevelPercent = 0
  bin.status = BinStatus.NORMAL
  bin.lastCollectedAt = new Date()
  await bin.save()

  await alertRepository.resolveAllForBin(binId)
  await wasteBinRepository.recordLevel(bin.id, 0)

  return { record, bin }
}

export async function listCollections() {
  return collectionRecordRepository.findAll()
}
