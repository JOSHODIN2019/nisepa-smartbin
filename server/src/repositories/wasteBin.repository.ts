import { WasteBin } from '../models/WasteBin.js'
import { WasteLevel } from '../models/WasteLevel.js'
import { BinLocationType } from '../types/enums.js'

const ASSIGNED_USER_FIELDS = 'name email'

export const wasteBinRepository = {
  findAllActive() {
    return WasteBin.find({ isActive: true }).sort({ code: 1 }).populate('assignedUserId', ASSIGNED_USER_FIELDS)
  },
  findAll() {
    return WasteBin.find().sort({ code: 1 }).populate('assignedUserId', ASSIGNED_USER_FIELDS)
  },
  findById(id: string) {
    return WasteBin.findById(id).populate('assignedUserId', ASSIGNED_USER_FIELDS)
  },
  findAssignedToUser(userId: string) {
    return WasteBin.find({ assignedUserId: userId }).sort({ code: 1 })
  },
  count() {
    return WasteBin.countDocuments()
  },
  findByCode(code: string) {
    return WasteBin.findOne({ code })
  },
  async create(input: {
    code: string
    name: string
    address: string
    capacityLiters: number
    locationType?: BinLocationType
    assignedUserId?: string | null
  }) {
    const bin = await WasteBin.create({
      code: input.code,
      name: input.name,
      location: { address: input.address },
      capacityLiters: input.capacityLiters,
      locationType: input.locationType ?? BinLocationType.ROADSIDE,
      assignedUserId: input.assignedUserId ?? null,
    })
    return bin.populate('assignedUserId', ASSIGNED_USER_FIELDS)
  },
  updateById(
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
    const update: Record<string, unknown> = { ...input }
    if (input.address !== undefined) {
      delete update.address
      update['location.address'] = input.address
    }
    return WasteBin.findByIdAndUpdate(id, update, { returnDocument: 'after' }).populate(
      'assignedUserId',
      ASSIGNED_USER_FIELDS,
    )
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
