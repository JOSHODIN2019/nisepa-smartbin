import { Alert } from '../models/Alert.js'
import type { AlertThreshold } from '../types/enums.js'

export const alertRepository = {
  create(input: { binId: string; threshold: AlertThreshold; message: string }) {
    return Alert.create(input)
  },
  findAll(limit = 100) {
    return Alert.find().sort({ createdAt: -1 }).limit(limit).populate('binId', 'name code location')
  },
  findById(id: string) {
    return Alert.findById(id).populate('binId', 'name code location')
  },
  resolveAllForBin(binId: string) {
    return Alert.updateMany({ binId, status: { $ne: 'resolved' } }, { status: 'resolved', resolvedAt: new Date() })
  },
}
