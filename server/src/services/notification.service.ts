import { notificationRepository } from '../repositories/notification.repository.js'
import { ApiError } from '../utils/ApiError.js'

export async function listNotifications(userId: string) {
  return notificationRepository.findForUser(userId)
}

export async function markNotificationRead(id: string, userId: string) {
  const notification = await notificationRepository.markRead(id, userId)
  if (!notification) throw ApiError.notFound('Notification not found')
  return notification
}

// Note: this notifies the user who triggered the crossing, confirming what
// happened. It does not notify NISEPA staff/admin — that's the Alert Engine
// (Stage 27), not yet built. Keep this message honest about that boundary.
export async function notifyThresholdCrossed(
  userId: string,
  binId: string,
  binName: string,
  status: 'warning' | 'high_priority' | 'full',
) {
  const statusLabel = status === 'high_priority' ? 'high priority' : status
  return notificationRepository.create({
    userId,
    title: `${binName} needs attention`,
    message: `Thanks for reporting — ${binName} is now ${statusLabel === 'full' ? 'full' : `at ${statusLabel} level`}.`,
    relatedBinId: binId,
  })
}
