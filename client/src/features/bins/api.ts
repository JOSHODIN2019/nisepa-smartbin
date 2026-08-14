import { api } from '@/lib/api'
import type { WasteBin } from './types'

export const binsApi = {
  list: () => api.get<{ bins: WasteBin[] }>('/bins'),
  get: (id: string) => api.get<{ bin: WasteBin }>(`/bins/${id}`),
  addWaste: (id: string) => api.post<{ bin: WasteBin }>(`/bins/${id}/waste`),
}
