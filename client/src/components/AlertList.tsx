import { useState } from 'react'
import type { Alert, AlertStatus } from '@/features/alerts/types'

const ALERT_STATUS_META: Record<AlertStatus, { label: string; badgeBg: string; badgeText: string }> = {
  new: { label: 'New', badgeBg: 'bg-status-full-bg', badgeText: 'text-status-full' },
  acknowledged: { label: 'Acknowledged', badgeBg: 'bg-status-warning-bg', badgeText: 'text-status-warning' },
  resolved: { label: 'Resolved', badgeBg: 'bg-status-normal-bg', badgeText: 'text-status-normal' },
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function AlertList({
  alerts,
  onAcknowledge,
  onResolve,
}: {
  alerts: Alert[]
  onAcknowledge: (id: string) => Promise<void>
  onResolve: (id: string) => Promise<void>
}) {
  const [pendingId, setPendingId] = useState<string | null>(null)

  async function handle(id: string, action: (id: string) => Promise<void>) {
    setPendingId(id)
    try {
      await action(id)
    } finally {
      setPendingId(null)
    }
  }

  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-200 p-8 text-center">
        <p className="text-sm text-neutral-500">No alerts. Bins will appear here once they cross a threshold.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0">
      {alerts.map((alert) => {
        const meta = ALERT_STATUS_META[alert.status]
        const binName = typeof alert.binId === 'string' ? alert.binId : alert.binId.name
        const binLocation = typeof alert.binId === 'string' ? null : alert.binId.location.address
        const isPending = pendingId === alert._id

        return (
          <li key={alert._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-4">
            <div className="flex items-start gap-3 sm:contents">
              <span className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${meta.badgeBg} ${meta.badgeText}`}>
                {meta.label}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900">{binName}</p>
                {binLocation && <p className="text-xs text-neutral-500">{binLocation}</p>}
                <p className="mt-1 text-sm text-neutral-600">{alert.message}</p>
                <p className="mt-1 text-xs text-neutral-500">{formatTime(alert.createdAt)}</p>
              </div>
            </div>
            <div className="flex shrink-0 gap-2 sm:ml-auto">
              {alert.status === 'new' && (
                <button
                  onClick={() => handle(alert._id, onAcknowledge)}
                  disabled={isPending}
                  className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50"
                >
                  Acknowledge
                </button>
              )}
              {alert.status !== 'resolved' && (
                <button
                  onClick={() => handle(alert._id, onResolve)}
                  disabled={isPending}
                  className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
                >
                  Resolve
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
