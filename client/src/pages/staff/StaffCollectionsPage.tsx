import { useEffect, useState } from 'react'
import { collectionsApi } from '@/features/collections/api'
import { useLiveBins } from '@/features/bins/useLiveBins'
import type { WasteBin } from '@/features/bins/types'
import type { CollectionRecord } from '@/features/collections/types'
import { StatusBadge } from '@/components/StatusBadge'
import { CollectionHistoryTable } from '@/components/CollectionHistoryTable'
import { ApiClientError } from '@/features/auth/AuthContext'
import { useEventStream } from '@/lib/useEventStream'

function NeedsCollectionRow({
  bin,
  onCollected,
}: {
  bin: WasteBin
  onCollected: (binId: string, notes: string) => Promise<void>
}) {
  const [notes, setNotes] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRecord() {
    setError(null)
    setIsRecording(true)
    try {
      await onCollected(bin.id, notes)
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not record the collection.')
    } finally {
      setIsRecording(false)
    }
  }

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-900">{bin.name}</p>
          <StatusBadge status={bin.status} />
        </div>
        <p className="text-xs text-neutral-500">
          {bin.location.address} · {bin.currentLevelPercent}% full
        </p>
        {error && <p className="mt-1 text-xs text-status-full">{error}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-40 rounded-md border border-neutral-200 px-2 py-1.5 text-xs shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <button
          onClick={handleRecord}
          disabled={isRecording}
          className="whitespace-nowrap rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {isRecording ? 'Recording…' : 'Record collection'}
        </button>
      </div>
    </li>
  )
}

export function StaffCollectionsPage() {
  const { bins, setBins } = useLiveBins()
  const [records, setRecords] = useState<CollectionRecord[] | null>(null)

  function refetchRecords() {
    collectionsApi.list().then(({ records }) => setRecords(records))
  }

  useEffect(refetchRecords, [])
  useEventStream({ 'collection.recorded': refetchRecords })

  async function handleCollected(binId: string, notes: string) {
    const { record } = await collectionsApi.record(binId, notes || undefined)
    setRecords((prev) => (prev ? [record, ...prev] : [record]))
    setBins((prev) => prev?.map((b) => (b.id === binId ? { ...b, currentLevelPercent: 0, status: 'normal' } : b)) ?? prev)
  }

  const needsCollection = bins?.filter((b) => b.isActive && b.status !== 'normal') ?? []

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Collections</h1>
      <p className="mt-1 text-neutral-500">Record a collection to reset a bin and resolve its alerts.</p>

      <h2 className="mt-8 text-sm font-semibold text-neutral-900">Needs collection</h2>
      <div className="mt-3">
        {bins === null ? (
          <p className="text-sm text-neutral-500">Loading bins…</p>
        ) : needsCollection.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-200 p-8 text-center">
            <p className="text-sm text-neutral-500">All bins are at a normal level. Nothing needs collecting right now.</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0">
            {needsCollection.map((bin) => (
              <NeedsCollectionRow key={bin.id} bin={bin} onCollected={handleCollected} />
            ))}
          </ul>
        )}
      </div>

      <h2 className="mt-10 text-sm font-semibold text-neutral-900">Collection history</h2>
      <div className="mt-3">
        {records === null ? <p className="text-sm text-neutral-500">Loading history…</p> : <CollectionHistoryTable records={records} />}
      </div>
    </div>
  )
}
