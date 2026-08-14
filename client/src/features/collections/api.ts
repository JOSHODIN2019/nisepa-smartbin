import { api } from '@/lib/api'
import type { CollectionRecord } from './types'
import type { WasteBin } from '@/features/bins/types'

export const collectionsApi = {
  list: () => api.get<{ records: CollectionRecord[] }>('/collections'),
  record: (binId: string, notes?: string) =>
    api.post<{ record: CollectionRecord; bin: Pick<WasteBin, 'id' | 'currentLevelPercent' | 'status'> }>(
      `/collections/${binId}`,
      { notes },
    ),
}
