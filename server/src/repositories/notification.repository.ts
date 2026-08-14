import { Notification } from '../models/Notification.js'

export const notificationRepository = {
  findForUser(userId: string, limit = 20) {
    return Notification.find({ userId }).sort({ createdAt: -1 }).limit(limit)
  },
  create(input: { userId: string; title: string; message: string; relatedBinId?: string }) {
    return Notification.create(input)
  },
  markRead(id: string, userId: string) {
    return Notification.findOneAndUpdate({ _id: id, userId }, { read: true }, { returnDocument: 'after' })
  },
}
