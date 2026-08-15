import type { AppNotification } from '@/features/notifications/types'

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function NotificationList({
  notifications,
  onMarkRead,
  emptyMessage = "No notifications yet. You'll see updates here once a bin you interact with crosses a threshold.",
}: {
  notifications: AppNotification[] | null
  onMarkRead: (id: string) => void
  emptyMessage?: string
}) {
  if (notifications === null) {
    return <p className="mt-3 text-sm text-neutral-500">Loading notifications…</p>
  }

  if (notifications.length === 0) {
    return (
      <div className="mt-3 rounded-lg border border-dashed border-neutral-200 p-8 text-center">
        <p className="text-sm text-neutral-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <ul className="mt-3 divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0">
      {notifications.map((n) => (
        <li key={n._id} className={`flex items-start gap-3 p-4 ${n.read ? '' : 'bg-brand-50/40'}`}>
          {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />}
          <div className={n.read ? 'pl-5' : ''}>
            <p className="text-sm font-medium text-neutral-900">{n.title}</p>
            <p className="mt-0.5 text-sm text-neutral-600">{n.message}</p>
            <p className="mt-1 text-xs text-neutral-400">{timeAgo(n.createdAt)}</p>
          </div>
          {!n.read && (
            <button
              onClick={() => onMarkRead(n._id)}
              className="ml-auto shrink-0 text-xs font-medium text-brand-700 hover:underline"
            >
              Mark read
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}
