import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, ApiClientError } from '@/features/auth/AuthContext'
import { NotificationList } from '@/components/NotificationList'
import { useLiveNotifications } from '@/features/notifications/useLiveNotifications'
import { useMyBins } from '@/features/bins/useMyBins'
import { binsApi } from '@/features/bins/api'
import type { WasteBin } from '@/features/bins/types'
import { SmartBinVisual } from '@/components/SmartBinVisual'
import { StatusBadge } from '@/components/StatusBadge'

function MyBinCard({ bin, onAddWaste }: { bin: WasteBin; onAddWaste: (id: string) => Promise<void> }) {
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReminding, setIsReminding] = useState(false)
  const [reminded, setReminded] = useState(false)
  const [reminderError, setReminderError] = useState<string | null>(null)
  const isFull = bin.currentLevelPercent >= 100

  async function handleAddWaste() {
    setError(null)
    setIsAdding(true)
    try {
      await onAddWaste(bin.id)
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not add waste. Please try again.')
    } finally {
      setIsAdding(false)
    }
  }

  async function handleRemind() {
    setReminderError(null)
    setIsReminding(true)
    try {
      await binsApi.remind(bin.id)
      setReminded(true)
    } catch (err) {
      setReminderError(err instanceof ApiClientError ? err.message : 'Could not send the reminder. Please try again.')
    } finally {
      setIsReminding(false)
    }
  }

  return (
    <div className="flex flex-col items-center rounded-lg border border-neutral-200 bg-neutral-0 p-6 text-center shadow-sm sm:flex-row sm:items-center sm:gap-6 sm:text-left">
      <SmartBinVisual levelPercent={bin.currentLevelPercent} status={bin.status} />
      <div className="mt-3 flex-1 sm:mt-0">
        <h3 className="text-sm font-semibold text-neutral-900">{bin.name}</h3>
        <p className="text-xs text-neutral-500">{bin.location.address}</p>
        <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
          <StatusBadge status={bin.status} />
          <span className="text-xs font-medium tabular-nums text-neutral-600">{bin.currentLevelPercent}% full</span>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-xs text-status-full">
            {error}
          </p>
        )}
        <button
          onClick={handleAddWaste}
          disabled={isAdding || isFull}
          className="mt-4 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {isFull ? 'Bin full — awaiting collection' : isAdding ? 'Adding…' : 'Add simulated waste'}
        </button>

        {isFull && (
          <div className="mt-3 rounded-md bg-status-full-bg px-3 py-2.5 sm:flex sm:items-center sm:justify-between sm:gap-3">
            <p className="text-xs text-status-full">
              {reminded
                ? 'NISEPA has been notified — thanks for the heads up.'
                : "Your bin is full. NISEPA is already aware, but you can send a reminder if it hasn't been collected."}
            </p>
            {!reminded && (
              <button
                onClick={handleRemind}
                disabled={isReminding}
                className="mt-2 w-full shrink-0 rounded-md border border-status-full bg-neutral-0 px-3 py-1.5 text-xs font-medium text-status-full transition-colors hover:bg-status-full-bg disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0 sm:w-auto"
              >
                {isReminding ? 'Sending…' : 'Remind NISEPA'}
              </button>
            )}
          </div>
        )}
        {reminderError && (
          <p role="alert" className="mt-2 text-xs text-status-full">
            {reminderError}
          </p>
        )}
      </div>
    </div>
  )
}

function MyBinSection() {
  const { bins, refetch } = useMyBins()

  async function handleAddWaste(id: string) {
    await binsApi.addWaste(id)
    refetch()
  }

  return (
    <div className="mt-10">
      <h2 className="text-sm font-semibold text-neutral-900">My bin</h2>
      {bins === null && <p className="mt-3 text-sm text-neutral-500">Loading your bin…</p>}
      {bins && bins.length === 0 && (
        <p className="mt-3 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500">
          No bin has been registered to your household yet. Contact NISEPA to have one assigned, or browse the{' '}
          <Link to="/smart-bin" className="font-medium text-brand-700 hover:underline">
            full smart bin network
          </Link>
          .
        </p>
      )}
      {bins && bins.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-4">
          {bins.map((bin) => (
            <MyBinCard key={bin.id} bin={bin} onAddWaste={handleAddWaste} />
          ))}
        </div>
      )}
    </div>
  )
}

export function PublicDashboardPage() {
  const { user } = useAuth()
  const firstName = user?.name.split(' ')[0]
  const { notifications, markRead } = useLiveNotifications()

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-semibold text-neutral-900">Welcome back, {firstName}</h1>
      <p className="mt-1 text-neutral-500">Here's what you can do on SmartBin.</p>

      <MyBinSection />

      <div className="mt-10">
        <h2 className="text-sm font-semibold text-neutral-900">Notifications</h2>
        <NotificationList notifications={notifications} onMarkRead={markRead} />
      </div>
    </div>
  )
}
