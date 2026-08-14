import { Schema, model, type InferSchemaType } from 'mongoose'
import { CollectionStatus } from '../types/enums.js'

const collectionRecordSchema = new Schema(
  {
    binId: { type: Schema.Types.ObjectId, ref: 'WasteBin', required: true, index: true },
    staffId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: Object.values(CollectionStatus), required: true, default: CollectionStatus.PENDING, index: true },
    levelBeforeCollection: { type: Number, required: true, min: 0, max: 100 },
    notes: { type: String, trim: true },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true },
)

export type CollectionRecordDoc = InferSchemaType<typeof collectionRecordSchema>
export const CollectionRecord = model('CollectionRecord', collectionRecordSchema)
