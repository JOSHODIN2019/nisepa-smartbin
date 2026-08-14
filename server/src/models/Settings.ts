import { Schema, model, type InferSchemaType } from 'mongoose'

// Singleton document (one row, fixed _id) — system-wide configuration.
// Stage 44: currently just the simulated waste-add range used by
// addSimulatedWaste() (Section 5.1), the one truly configurable knob this
// prototype has. Deliberately not a place to change the 80/90/100 thresholds
// themselves — those are fixed by PROJECT_MEMORY.md Section 7.
const settingsSchema = new Schema(
  {
    _id: { type: String, default: 'system' },
    simulatedWasteMinPercent: { type: Number, required: true, default: 5, min: 1, max: 100 },
    simulatedWasteMaxPercent: { type: Number, required: true, default: 15, min: 1, max: 100 },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: false, updatedAt: true } },
)

export type SettingsDoc = InferSchemaType<typeof settingsSchema>
export const Settings = model('Settings', settingsSchema)
