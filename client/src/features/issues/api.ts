import { api } from '@/lib/api'

export const issuesApi = {
  create: (input: { description: string; locationText?: string }) =>
    api.post<{ report: { id: string; status: string; createdAt: string } }>('/issues', input),
}
