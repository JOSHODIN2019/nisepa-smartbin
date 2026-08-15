import { notificationRepository } from '../repositories/notification.repository.js'
import { userRepository } from '../repositories/user.repository.js'
import { ApiError } from '../utils/ApiError.js'
import { UserRole } from '../types/enums.js'

export async function listNotifications(userId: string) {
  return notificationRepository.findForUser(userId)
}

export async function markNotificationRead(id: string, userId: string) {
  const notification = await notificationRepository.markRead(id, userId)
  if (!notification) throw ApiError.notFound('Notification not found')
  return notification
}

// Notifies the user who triggered the crossing — a personal confirmation of
// what their action did. Distinct from notifyStaffAndAdminOfAlert below,
// which is the staff/admin-facing counterpart (Stage 28).
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

// Stage 28 (Notification Engine, staff/admin side). The Alert Engine (Stage
// 27) creates the shared Alert record everyone sees in the Alert Center;
// this creates a *personal* notification for every active staff/admin
// account, so they have an inbox like public users do, not just a shared
// list they have to remember to check.
export async function notifyStaffAndAdminOfAlert(binId: string, binName: string, threshold: 80 | 90 | 100) {
  const staffAndAdmins = await userRepository.findActiveByRoles([UserRole.STAFF, UserRole.ADMIN])
  const label = threshold === 100 ? 'Full' : threshold === 90 ? 'High Priority' : 'Warning'

  await Promise.all(
    staffAndAdmins.map((user) =>
      notificationRepository.create({
        userId: user.id,
        title: `${binName} needs attention`,
        message: `${binName} has crossed the ${label} (${threshold}%) threshold.`,
        relatedBinId: binId,
      }),
    ),
  )
}
