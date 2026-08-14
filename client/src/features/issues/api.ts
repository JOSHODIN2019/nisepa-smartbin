import { api } from '@/lib/api'
import type { IssueReport } from './types'

export const issuesApi = {
  create: (input: { description: string; locationText?: string }) =>
    api.post<{ report: { id: string; status: string; createdAt: string } }>('/issues', input),
  list: () => api.get<{ reports: IssueReport[] }>('/issues'),
  stats: () => api.get<{ newCount: number }>('/issues/stats'),
}
