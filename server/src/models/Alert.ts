import { Schema, model, type InferSchemaType } from 'mongoose'
import { AlertStatus, AlertThreshold } from '../types/enums.js'

// One alert per threshold crossing (80/90/100) per bin per fill cycle — see alert
// engine (Stage 27), which must avoid duplicate alerts for the same crossing.
const alertSchema = new Schema(
  {
    binId: { type: Schema.Types.ObjectId, ref: 'WasteBin', required: true, index: true },
    threshold: { type: Number, enum: Object.values(AlertThreshold), required: true },
    status: { type: String, enum: Object.values(AlertStatus), required: true, default: AlertStatus.NEW, index: true },
    message: { type: String, required: true },
    acknowledgedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    acknowledgedAt: { type: Date },
    resolvedAt: { type: Date },
  },
  { timestamps: true },
)

export type AlertDoc = InferSchemaType<typeof alertSchema>
export const Alert = model('Alert', alertSchema)
