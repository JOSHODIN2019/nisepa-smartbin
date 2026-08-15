import { api } from '@/lib/api'
import type { WasteBin } from './types'

export interface WasteLevelReading {
  levelPercent: number
  source: string
  recordedAt: string
}

export const binsApi = {
  list: () => api.get<{ bins: WasteBin[] }>('/bins'),
  mine: () => api.get<{ bins: WasteBin[] }>('/bins/mine'),
  get: (id: string) => api.get<{ bin: WasteBin }>(`/bins/${id}`),
  levels: (id: string) => api.get<{ levels: WasteLevelReading[] }>(`/bins/${id}/levels`),
  addWaste: (id: string) => api.post<{ bin: WasteBin }>(`/bins/${id}/waste`),
  create: (input: {
    code: string
    name: string
    address: string
    capacityLiters: number
    locationType?: 'roadside' | 'house'
    assignedUserId?: string
  }) => api.post<{ bin: WasteBin }>('/bins', input),
  update: (
    id: string,
    input: {
      name?: string
      address?: string
      capacityLiters?: number
      isActive?: boolean
      locationType?: 'roadside' | 'house'
      assignedUserId?: string | null
    },
  ) => api.patch<{ bin: WasteBin }>(`/bins/${id}`, input),
}
