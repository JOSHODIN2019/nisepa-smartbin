import { api } from '@/lib/api'
import type { Report } from './types'

export const reportsApi = {
  list: () => api.get<{ reports: Report[] }>('/reports'),
  get: (id: string) => api.get<{ report: Report }>(`/reports/${id}`),
  generate: () => api.post<{ report: Report }>('/reports', { type: 'collections-summary' }),
}
