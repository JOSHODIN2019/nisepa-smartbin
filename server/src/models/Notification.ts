import { Schema, model, type InferSchemaType } from 'mongoose'

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    relatedAlertId: { type: Schema.Types.ObjectId, ref: 'Alert' },
    relatedBinId: { type: Schema.Types.ObjectId, ref: 'WasteBin' },
    read: { type: Boolean, required: true, default: false, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export type NotificationDoc = InferSchemaType<typeof notificationSchema>
export const Notification = model('Notification', notificationSchema)
