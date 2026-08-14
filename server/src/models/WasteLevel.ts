import { Schema, model, type InferSchemaType } from 'mongoose'
import { LevelSource } from '../types/enums.js'

// Append-only history of level readings for a bin — the simulated IoT sensor feed.
const wasteLevelSchema = new Schema(
  {
    binId: { type: Schema.Types.ObjectId, ref: 'WasteBin', required: true, index: true },
    levelPercent: { type: Number, required: true, min: 0, max: 100 },
    source: { type: String, enum: Object.values(LevelSource), required: true, default: LevelSource.SIMULATED_SENSOR },
    recordedAt: { type: Date, required: true, default: Date.now, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export type WasteLevelDoc = InferSchemaType<typeof wasteLevelSchema>
export const WasteLevel = model('WasteLevel', wasteLevelSchema)
