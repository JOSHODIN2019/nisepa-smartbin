import { useEffect, useState } from 'react'
import { notificationsApi } from './api'
import type { AppNotification } from './types'
import { useEventStream } from '@/lib/useEventStream'

// Stage 20 (public) + Stage 28 (staff/admin) — refetches on 'notification.created'
// so a personal notification inbox stays live without a manual refresh.
export function useLiveNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[] | null>(null)

  function refetch() {
    notificationsApi
      .list()
      .then(({ notifications }) => setNotifications(notifications))
      .catch(() => setNotifications([]))
  }

  useEffect(refetch, [])
  useEventStream({ 'notification.created': refetch })

  async function markRead(id: string) {
    setNotifications((prev) => prev?.map((n) => (n._id === id ? { ...n, read: true } : n)) ?? prev)
    try {
      await notificationsApi.markRead(id)
    } catch {
      // Non-critical — leave it marked read locally even if the request fails.
    }
  }

  return { notifications, markRead }
}
