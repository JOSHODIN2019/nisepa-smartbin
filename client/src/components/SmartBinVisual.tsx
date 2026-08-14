import type { BinStatus } from '@/features/bins/types'

const STATUS_FILL_COLOR: Record<BinStatus, string> = {
  normal: 'var(--color-status-normal)',
  warning: 'var(--color-status-warning)',
  high_priority: 'var(--color-status-high)',
  full: 'var(--color-status-full)',
}

const BODY_TOP = 30
const BODY_HEIGHT = 120

export function SmartBinVisual({ levelPercent, status }: { levelPercent: number; status: BinStatus }) {
  const clampedLevel = Math.min(100, Math.max(0, levelPercent))
  const fillHeight = (clampedLevel / 100) * BODY_HEIGHT
  const fillY = BODY_TOP + (BODY_HEIGHT - fillHeight)

  return (
    <svg viewBox="0 0 120 170" className="h-40 w-32" role="img" aria-label={`Bin ${clampedLevel}% full, status ${status}`}>
      <defs>
        <clipPath id="bin-body-clip">
          <rect x="20" y={BODY_TOP} width="80" height={BODY_HEIGHT} rx="8" />
        </clipPath>
      </defs>

      {/* Body outline */}
      <rect
        x="20"
        y={BODY_TOP}
        width="80"
        height={BODY_HEIGHT}
        rx="8"
        fill="var(--color-neutral-50)"
        stroke="var(--color-neutral-300)"
        strokeWidth="2"
      />

      {/* Fill level, clipped to the body shape */}
      <rect
        x="20"
        y={fillY}
        width="80"
        height={fillHeight}
        fill={STATUS_FILL_COLOR[status]}
        clipPath="url(#bin-body-clip)"
        style={{ transition: 'y 700ms ease, height 700ms ease, fill 400ms ease' }}
      />

      {/* Lid */}
      <rect x="15" y="15" width="90" height="16" rx="4" fill="var(--color-neutral-700)" />
      <rect x="50" y="8" width="20" height="10" rx="3" fill="var(--color-neutral-700)" />

      {/* Percentage label */}
      <text
        x="60"
        y="95"
        textAnchor="middle"
        className="text-lg font-bold"
        fill={clampedLevel > 45 ? 'white' : 'var(--color-neutral-700)'}
        style={{ transition: 'fill 400ms ease' }}
      >
        {clampedLevel}%
      </text>
    </svg>
  )
}
