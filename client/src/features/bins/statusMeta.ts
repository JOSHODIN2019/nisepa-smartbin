import type { BinStatus } from './types'

export const STATUS_META: Record<BinStatus, { label: string; badgeBg: string; badgeText: string; dot: string }> = {
  normal: { label: 'Normal', badgeBg: 'bg-status-normal-bg', badgeText: 'text-status-normal', dot: 'bg-status-normal' },
  warning: { label: 'Warning', badgeBg: 'bg-status-warning-bg', badgeText: 'text-status-warning', dot: 'bg-status-warning' },
  high_priority: { label: 'High Priority', badgeBg: 'bg-status-high-bg', badgeText: 'text-status-high', dot: 'bg-status-high' },
  full: { label: 'Full', badgeBg: 'bg-status-full-bg', badgeText: 'text-status-full', dot: 'bg-status-full' },
}
