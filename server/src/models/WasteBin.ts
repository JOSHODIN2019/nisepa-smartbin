import { Schema, model, type InferSchemaType } from 'mongoose'
import { BinStatus, BinLocationType } from '../types/enums.js'

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
    locationType: {
      type: String,
      enum: Object.values(BinLocationType),
      required: true,
      default: BinLocationType.ROADSIDE,
      index: true,
    },
    // Only set when locationType is 'house' — the one public-role resident
    // who sees this bin on their personal dashboard. Never set for roadside
    // bins; enforced in the service layer, not just left to convention.
    assignedUserId: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  },
  { timestamps: true },
)

export type WasteBinDoc = InferSchemaType<typeof wasteBinSchema>
export const WasteBin = model('WasteBin', wasteBinSchema)
