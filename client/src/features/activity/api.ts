import { api } from '@/lib/api'
import type { ActivityLogEntry } from './types'

export const activityApi = {
  list: () => api.get<{ logs: ActivityLogEntry[] }>('/activity'),
}
