import { useEffect, useState } from 'react'
import { SmartBinVisual } from '@/components/SmartBinVisual'
import { StatusBadge } from '@/components/StatusBadge'
import { binsApi } from '@/features/bins/api'
import type { WasteBin } from '@/features/bins/types'
import { ApiClientError } from '@/features/auth/AuthContext'
import { useEventStream } from '@/lib/useEventStream'

function BinCard({ bin, onAddWaste }: { bin: WasteBin; onAddWaste: (id: string) => Promise<void> }) {
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const isFull = bin.currentLevelPercent >= 100

  return (
    <div className="flex flex-col items-center rounded-lg border border-neutral-200 bg-neutral-0 p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
      <SmartBinVisual levelPercent={bin.currentLevelPercent} status={bin.status} />

      <h3 className="mt-3 text-sm font-semibold text-neutral-900">{bin.name}</h3>
      <p className="text-xs text-neutral-500">{bin.location.address}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <StatusBadge status={bin.status} />
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ${
            bin.locationType === 'house' ? 'bg-brand-50 text-brand-700' : 'bg-neutral-100 text-neutral-600'
          }`}
        >
          {bin.locationType === 'house' ? 'Residence' : 'Roadside'}
        </span>
      </div>

      <button
        onClick={handleAddWaste}
        disabled={isAdding || isFull}
        className="mt-4 w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isFull ? 'Bin full — awaiting collection' : isAdding ? 'Adding…' : 'Add simulated waste'}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-xs text-status-full">
          {error}
        </p>
      )}
    </div>
  )
}

export function SmartBinPage() {
  const [bins, setBins] = useState<WasteBin[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    binsApi
      .list()
      .then(({ bins }) => setBins(bins))
      .catch((err) => setLoadError(err instanceof ApiClientError ? err.message : 'Could not load bins.'))
  }, [])

  async function handleAddWaste(id: string) {
    const { bin } = await binsApi.addWaste(id)
    setBins((prev) => (prev ? prev.map((b) => (b.id === id ? bin : b)) : prev))
  }

  // Stage 25/33 — live updates from any visitor's interaction, not just this
  // browser tab's own actions. Merges since the event payload is sometimes a
  // full bin DTO (add-waste, create, update) and sometimes partial (a
  // collection only changes id/currentLevelPercent/status).
  useEventStream({
    'bin.updated': (data) => {
      const patch = data as Partial<WasteBin> & { id: string }
      setBins((prev) => prev?.map((b) => (b.id === patch.id ? { ...b, ...patch } : b)) ?? prev)
    },
  })

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">Smart bin network</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        Every registered bin, roadside and household alike — visible to everyone, logged in or not. These bins
        simulate real ultrasonic-sensor readings. Click "Add simulated waste" on any bin to see its level rise —
        the same update NISEPA staff and administrators see on their dashboards, live. A resident's own household
        bin also appears on their personal dashboard after logging in.
      </p>

      {loadError && (
        <p role="alert" className="mt-8 rounded-md bg-status-full-bg px-4 py-3 text-sm text-status-full">
          {loadError}
        </p>
      )}

      {!bins && !loadError && <p className="mt-8 text-sm text-neutral-500">Loading bins…</p>}

      {bins && bins.length === 0 && (
        <p className="mt-8 text-sm text-neutral-500">No bins have been registered yet.</p>
      )}

      {bins && bins.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bins.map((bin) => (
            <BinCard key={bin.id} bin={bin} onAddWaste={handleAddWaste} />
          ))}
        </div>
      )}
    </div>
  )
}
