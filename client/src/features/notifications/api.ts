import { api } from '@/lib/api'
import type { AppNotification } from './types'

export const notificationsApi = {
  list: () => api.get<{ notifications: AppNotification[] }>('/notifications'),
  markRead: (id: string) => api.patch<{ notification: AppNotification }>(`/notifications/${id}/read`),
}
