import { STATUS_META } from '@/features/bins/statusMeta'
import type { BinStatus } from '@/features/bins/types'

export function StatusBadge({ status }: { status: BinStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${meta.badgeBg} ${meta.badgeText}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}
