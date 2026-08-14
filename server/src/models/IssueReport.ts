import { Schema, model, type InferSchemaType } from 'mongoose'

export const IssueReportStatus = {
  NEW: 'new',
  REVIEWED: 'reviewed',
  RESOLVED: 'resolved',
} as const
export type IssueReportStatus = (typeof IssueReportStatus)[keyof typeof IssueReportStatus]

// Public-submitted waste problem reports (Section 6.1) — distinct from the
// `reports` collection (Stage 42 generated analytics snapshots).
const issueReportSchema = new Schema(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User' }, // absent for anonymous reports
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    locationText: { type: String, trim: true, maxlength: 200 },
    relatedBinId: { type: Schema.Types.ObjectId, ref: 'WasteBin' },
    status: { type: String, enum: Object.values(IssueReportStatus), required: true, default: IssueReportStatus.NEW, index: true },
  },
  { timestamps: true },
)

export type IssueReportDoc = InferSchemaType<typeof issueReportSchema>
export const IssueReport = model('IssueReport', issueReportSchema)
