import { api } from '@/lib/api'
import type { Alert } from './types'

export const alertsApi = {
  list: () => api.get<{ alerts: Alert[] }>('/alerts'),
  acknowledge: (id: string) => api.patch<{ alert: Alert }>(`/alerts/${id}/acknowledge`),
  resolve: (id: string) => api.patch<{ alert: Alert }>(`/alerts/${id}/resolve`),
}
