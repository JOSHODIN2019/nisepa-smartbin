import { useEffect, useState } from 'react'
import { activityApi } from '@/features/activity/api'
import type { ActivityLogEntry } from '@/features/activity/types'

const ACTION_LABEL: Record<string, string> = {
  'bin.create': 'created bin',
  'bin.update': 'updated bin',
  'bin.deactivate': 'deactivated bin',
  'bin.reactivate': 'reactivated bin',
  'user.create': 'created account',
  'user.update': 'updated account',
  'user.deactivate': 'deactivated account',
  'user.reactivate': 'reactivated account',
  'collection.record': 'recorded a collection for bin',
  'alert.acknowledge': 'acknowledged alert on',
  'alert.resolve': 'resolved alert on',
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLogEntry[] | null>(null)

  useEffect(() => {
    activityApi.list().then(({ logs }) => setLogs(logs))
  }, [])

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">System activity</h1>
      <p className="mt-1 text-neutral-500">An audit trail of administrative and staff actions across the system.</p>

      <div className="mt-6">
        {logs === null ? (
          <p className="text-sm text-neutral-500">Loading activity…</p>
        ) : logs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-200 p-8 text-center">
            <p className="text-sm text-neutral-500">No activity recorded yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0">
            {logs.map((log) => {
              const actorName = typeof log.userId === 'string' ? log.userId : log.userId?.name ?? 'System'
              const actorRole = typeof log.userId === 'string' ? null : log.userId?.role
              return (
                <li key={log._id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-neutral-800">
                    <span className="font-medium text-neutral-900">{actorName}</span>
                    {actorRole && <span className="text-xs text-neutral-500"> ({actorRole})</span>}{' '}
                    {ACTION_LABEL[log.action] ?? log.action} <span className="text-neutral-500">{log.targetType}</span>
                  </p>
                  <p className="text-xs text-neutral-500">{formatTime(log.createdAt)}</p>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
