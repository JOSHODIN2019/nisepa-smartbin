import { api } from '@/lib/api'
import type { WasteBin } from './types'

export const binsApi = {
  list: () => api.get<{ bins: WasteBin[] }>('/bins'),
  get: (id: string) => api.get<{ bin: WasteBin }>(`/bins/${id}`),
  addWaste: (id: string) => api.post<{ bin: WasteBin }>(`/bins/${id}/waste`),
  create: (input: { code: string; name: string; address: string; capacityLiters: number }) =>
    api.post<{ bin: WasteBin }>('/bins', input),
  update: (id: string, input: { name?: string; address?: string; capacityLiters?: number; isActive?: boolean }) =>
    api.patch<{ bin: WasteBin }>(`/bins/${id}`, input),
}
