import { api } from '@/lib/api'
import type { SystemSettings } from './types'

export const settingsApi = {
  get: () => api.get<{ settings: SystemSettings }>('/settings'),
  update: (input: { simulatedWasteMinPercent?: number; simulatedWasteMaxPercent?: number }) =>
    api.patch<{ settings: SystemSettings }>('/settings', input),
}
