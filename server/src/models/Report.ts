import { Schema, model, type InferSchemaType } from 'mongoose'

// Snapshot of a generated report (Stage 42). `data` holds the computed payload
// so historical reports remain stable even if the underlying records change later.
const reportSchema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true, trim: true }, // e.g. "collections-summary", "bin-activity"
    generatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export type ReportDoc = InferSchemaType<typeof reportSchema>
export const Report = model('Report', reportSchema)
