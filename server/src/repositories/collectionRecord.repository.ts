import { CollectionRecord } from '../models/CollectionRecord.js'

export const collectionRecordRepository = {
  async create(input: { binId: string; staffId: string; levelBeforeCollection: number; notes?: string }) {
    const now = new Date()
    const record = await CollectionRecord.create({
      ...input,
      status: 'completed',
      completedAt: now,
    })
    return record.populate([
      { path: 'binId', select: 'name code location' },
      { path: 'staffId', select: 'name' },
    ])
  },
  findAll(limit = 100) {
    return CollectionRecord.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('binId', 'name code location')
      .populate('staffId', 'name')
  },
}
