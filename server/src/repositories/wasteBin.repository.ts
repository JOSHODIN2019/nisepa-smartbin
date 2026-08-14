import { WasteBin } from '../models/WasteBin.js'
import { WasteLevel } from '../models/WasteLevel.js'

export const wasteBinRepository = {
  findAllActive() {
    return WasteBin.find({ isActive: true }).sort({ code: 1 })
  },
  findById(id: string) {
    return WasteBin.findById(id)
  },
  count() {
    return WasteBin.countDocuments()
  },
  insertMany(bins: Parameters<typeof WasteBin.insertMany>[0]) {
    return WasteBin.insertMany(bins)
  },
  recordLevel(binId: string, levelPercent: number) {
    return WasteLevel.create({ binId, levelPercent })
  },
  recentLevels(binId: string, limit = 20) {
    return WasteLevel.find({ binId }).sort({ recordedAt: -1 }).limit(limit)
  },
}
