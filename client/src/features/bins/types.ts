export type BinStatus = 'normal' | 'warning' | 'high_priority' | 'full'
export type BinLocationType = 'roadside' | 'house'

export interface WasteBin {
  id: string
  code: string
  name: string
  location: { address: string; lat?: number; lng?: number }
  capacityLiters: number
  currentLevelPercent: number
  status: BinStatus
  isActive: boolean
  lastCollectedAt: string | null
  updatedAt: string
  locationType: BinLocationType
  assignedUserId: string | null
  assignedUserName: string | null
}
