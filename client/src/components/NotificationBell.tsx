import { useEffect, useRef, useState } from 'react'
import { useLiveNotifications } from '@/features/notifications/useLiveNotifications'
import { NotificationList } from '@/components/NotificationList'

// Stage 28 — the staff/admin counterpart to the public dashboard's inline
// notification list: a personal inbox reachable from anywhere in the
// staff/admin area, not just one page.
export function NotificationBell() {
  const { notifications, markRead } = useLiveNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        className="relative rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-status-full px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-neutral-200 bg-neutral-0 p-3 shadow-lg">
          <p className="px-1 text-sm font-semibold text-neutral-900">Notifications</p>
          <div className="max-h-96 overflow-y-auto">
            <NotificationList
              notifications={notifications}
              onMarkRead={markRead}
              emptyMessage="No notifications yet. You'll be notified here when a bin crosses a threshold."
            />
          </div>
        </div>
      )}
    </div>
  )
}
