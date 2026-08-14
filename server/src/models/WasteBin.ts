import { Schema, model, type InferSchemaType } from 'mongoose'
import { BinStatus } from '../types/enums.js'

const wasteBinSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true }, // e.g. "NISEPA-BIN-001"
    name: { type: String, required: true, trim: true },
    location: {
      address: { type: String, required: true, trim: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    capacityLiters: { type: Number, required: true, min: 1 },
    currentLevelPercent: { type: Number, required: true, default: 0, min: 0, max: 100, index: true },
    status: { type: String, enum: Object.values(BinStatus), required: true, default: BinStatus.NORMAL, index: true },
    isActive: { type: Boolean, default: true },
    lastCollectedAt: { type: Date },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

export type WasteBinDoc = InferSchemaType<typeof wasteBinSchema>
export const WasteBin = model('WasteBin', wasteBinSchema)
