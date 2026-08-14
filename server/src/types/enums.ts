export const UserRole = {
  PUBLIC: 'public',
  STAFF: 'staff',
  ADMIN: 'admin',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// Waste-level thresholds — PROJECT_MEMORY.md Section 7. Single source of truth;
// every status computation in the app must derive from this, never redefine the cutoffs.
export const BinStatus = {
  NORMAL: 'normal', // 0-79%
  WARNING: 'warning', // 80-89%
  HIGH_PRIORITY: 'high_priority', // 90-99%
  FULL: 'full', // 100%
} as const
export type BinStatus = (typeof BinStatus)[keyof typeof BinStatus]

export function getBinStatus(levelPercent: number): BinStatus {
  if (levelPercent >= 100) return BinStatus.FULL
  if (levelPercent >= 90) return BinStatus.HIGH_PRIORITY
  if (levelPercent >= 80) return BinStatus.WARNING
  return BinStatus.NORMAL
}

export const AlertThreshold = {
  EIGHTY: 80,
  NINETY: 90,
  HUNDRED: 100,
} as const
export type AlertThreshold = (typeof AlertThreshold)[keyof typeof AlertThreshold]

export function statusToAlertThreshold(status: BinStatus): AlertThreshold | null {
  switch (status) {
    case BinStatus.WARNING:
      return AlertThreshold.EIGHTY
    case BinStatus.HIGH_PRIORITY:
      return AlertThreshold.NINETY
    case BinStatus.FULL:
      return AlertThreshold.HUNDRED
    default:
      return null
  }
}

export const AlertStatus = {
  NEW: 'new',
  ACKNOWLEDGED: 'acknowledged',
  RESOLVED: 'resolved',
} as const
export type AlertStatus = (typeof AlertStatus)[keyof typeof AlertStatus]

export const CollectionStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const
export type CollectionStatus = (typeof CollectionStatus)[keyof typeof CollectionStatus]

export const LevelSource = {
  SIMULATED_SENSOR: 'simulated_sensor',
  PUBLIC_CONTRIBUTION: 'public_contribution',
  MANUAL_ADJUSTMENT: 'manual_adjustment',
} as const
export type LevelSource = (typeof LevelSource)[keyof typeof LevelSource]
