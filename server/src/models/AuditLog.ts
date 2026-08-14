import { Schema, model, type InferSchemaType } from 'mongoose'

const auditLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, // absent for system-generated events
    action: { type: String, required: true, trim: true }, // e.g. "bin.create", "alert.acknowledge"
    targetType: { type: String, required: true, trim: true },
    targetId: { type: Schema.Types.ObjectId },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
)

export type AuditLogDoc = InferSchemaType<typeof auditLogSchema>
export const AuditLog = model('AuditLog', auditLogSchema)
