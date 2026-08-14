import { WasteBin } from '../models/WasteBin.js'
import { WasteLevel } from '../models/WasteLevel.js'

export const wasteBinRepository = {
  findAllActive() {
    return WasteBin.find({ isActive: true }).sort({ code: 1 })
  },
  findAll() {
    return WasteBin.find().sort({ code: 1 })
  },
  findById(id: string) {
    return WasteBin.findById(id)
  },
  count() {
    return WasteBin.countDocuments()
  },
  findByCode(code: string) {
    return WasteBin.findOne({ code })
  },
  create(input: { code: string; name: string; address: string; capacityLiters: number }) {
    return WasteBin.create({
      code: input.code,
      name: input.name,
      location: { address: input.address },
      capacityLiters: input.capacityLiters,
    })
  },
  updateById(id: string, input: { name?: string; address?: string; capacityLiters?: number; isActive?: boolean }) {
    const update: Record<string, unknown> = { ...input }
    if (input.address !== undefined) {
      delete update.address
      update['location.address'] = input.address
    }
    return WasteBin.findByIdAndUpdate(id, update, { returnDocument: 'after' })
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
