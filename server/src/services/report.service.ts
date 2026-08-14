import { CollectionRecord } from '../models/CollectionRecord.js'
import { reportRepository } from '../repositories/report.repository.js'
import { ApiError } from '../utils/ApiError.js'

interface CollectionsSummaryData {
  totalCollections: number
  estimatedLitersCollected: number
  byBin: Array<{ binName: string; binCode: string; collections: number; estimatedLiters: number }>
}

// Real aggregation over actual CollectionRecord data — never fabricated
// numbers. "Estimated liters" is levelBeforeCollection% of the bin's
// capacityLiters at the time of each collection; clearly labeled as an
// estimate since no real weight/volume sensor exists (this is a simulation).
async function computeCollectionsSummary(periodStart?: Date, periodEnd?: Date): Promise<CollectionsSummaryData> {
  const dateFilter: Record<string, Date> = {}
  if (periodStart) dateFilter.$gte = periodStart
  if (periodEnd) dateFilter.$lte = periodEnd

  const query = Object.keys(dateFilter).length > 0 ? { completedAt: dateFilter } : {}
  const records = await CollectionRecord.find(query).populate<{
    binId: { name: string; code: string; capacityLiters: number }
  }>('binId', 'name code capacityLiters')

  const byBinMap = new Map<string, { binName: string; binCode: string; collections: number; estimatedLiters: number }>()
  let totalLiters = 0

  for (const record of records) {
    const bin = record.binId
    if (!bin || typeof bin === 'string') continue
    const liters = Math.round((record.levelBeforeCollection / 100) * bin.capacityLiters)
    totalLiters += liters

    const existing = byBinMap.get(bin.code)
    if (existing) {
      existing.collections += 1
      existing.estimatedLiters += liters
    } else {
      byBinMap.set(bin.code, { binName: bin.name, binCode: bin.code, collections: 1, estimatedLiters: liters })
    }
  }

  return {
    totalCollections: records.length,
    estimatedLitersCollected: totalLiters,
    byBin: Array.from(byBinMap.values()).sort((a, b) => b.collections - a.collections),
  }
}

export async function generateCollectionsSummaryReport(generatedBy: string, periodStart?: Date, periodEnd?: Date) {
  const data = await computeCollectionsSummary(periodStart, periodEnd)
  const title = periodStart && periodEnd ? `Collections Summary (${periodStart.toDateString()} – ${periodEnd.toDateString()})` : 'Collections Summary (all time)'

  return reportRepository.create({
    title,
    type: 'collections-summary',
    generatedBy,
    periodStart,
    periodEnd,
    data,
  })
}

export async function listReports() {
  return reportRepository.findAll()
}

export async function getReport(id: string) {
  const report = await reportRepository.findById(id)
  if (!report) throw ApiError.notFound('Report not found')
  return report
}
