import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { binsApi, type WasteLevelReading } from '@/features/bins/api'
import { alertsApi } from '@/features/alerts/api'
import { collectionsApi } from '@/features/collections/api'
import type { WasteBin } from '@/features/bins/types'
import type { Alert } from '@/features/alerts/types'
import type { CollectionRecord } from '@/features/collections/types'
import { SmartBinVisual } from '@/components/SmartBinVisual'
import { StatusBadge } from '@/components/StatusBadge'
import { useEventStream } from '@/lib/useEventStream'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function BinDetailPage({ basePath }: { basePath: '/staff' | '/admin' }) {
  const { id } = useParams<{ id: string }>()
  const [bin, setBin] = useState<WasteBin | null>(null)
  const [levels, setLevels] = useState<WasteLevelReading[] | null>(null)
  const [alerts, setAlerts] = useState<Alert[] | null>(null)
  const [collections, setCollections] = useState<CollectionRecord[] | null>(null)
  const [notFound, setNotFound] = useState(false)

  function refetchAll() {
    if (!id) return
    binsApi.get(id).then(({ bin }) => setBin(bin)).catch(() => setNotFound(true))
    binsApi.levels(id).then(({ levels }) => setLevels(levels))
    alertsApi.list().then(({ alerts }) => setAlerts(alerts.filter((a) => (typeof a.binId === 'string' ? a.binId : a.binId._id) === id)))
    collectionsApi
      .list()
      .then(({ records }) => setCollections(records.filter((r) => (typeof r.binId === 'string' ? r.binId : r.binId._id) === id)))
  }

  useEffect(refetchAll, [id])
  useEventStream({
    'bin.updated': refetchAll,
    'alert.created': refetchAll,
    'alert.updated': refetchAll,
    'collection.recorded': refetchAll,
  })

  if (notFound) {
    return (
      <div className="px-8 py-8">
        <p className="text-sm text-neutral-500">Bin not found.</p>
        <Link to={`${basePath}/bins`} className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline">
          Back to bin monitoring
        </Link>
      </div>
    )
  }

  if (!bin) {
    return (
      <div className="px-8 py-8">
        <p className="text-sm text-neutral-500">Loading bin…</p>
      </div>
    )
  }

  return (
    <div className="px-8 py-8">
      <Link to={`${basePath}/bins`} className="text-sm font-medium text-brand-700 hover:underline">
        ← Back to bin monitoring
      </Link>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row">
        <div className="flex shrink-0 flex-col items-center rounded-lg border border-neutral-200 bg-neutral-0 p-6">
          <SmartBinVisual levelPercent={bin.currentLevelPercent} status={bin.status} />
          <div className="mt-3">
            <StatusBadge status={bin.status} />
          </div>
        </div>

        <div className="flex-1 rounded-lg border border-neutral-200 bg-neutral-0 p-6">
          <h1 className="text-2xl font-semibold text-neutral-900">{bin.name}</h1>
          <p className="text-sm text-neutral-500">{bin.code}</p>

          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Location</dt>
              <dd className="mt-0.5 text-sm text-neutral-900">{bin.location.address}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Capacity</dt>
              <dd className="mt-0.5 text-sm text-neutral-900">{bin.capacityLiters}L</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Last updated</dt>
              <dd className="mt-0.5 text-sm text-neutral-900">{formatTime(bin.updatedAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">Last collected</dt>
              <dd className="mt-0.5 text-sm text-neutral-900">{bin.lastCollectedAt ? formatTime(bin.lastCollectedAt) : 'Never'}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Level history</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0">
            {levels === null ? (
              <p className="p-4 text-sm text-neutral-500">Loading…</p>
            ) : levels.length === 0 ? (
              <p className="p-4 text-sm text-neutral-500">No readings recorded yet.</p>
            ) : (
              <ul className="divide-y divide-neutral-200">
                {levels.map((l, i) => (
                  <li key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="font-medium tabular-nums text-neutral-900">{l.levelPercent}%</span>
                    <span className="text-neutral-500">{formatTime(l.recordedAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Alerts for this bin</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0">
            {alerts === null ? (
              <p className="p-4 text-sm text-neutral-500">Loading…</p>
            ) : alerts.length === 0 ? (
              <p className="p-4 text-sm text-neutral-500">No alerts for this bin.</p>
            ) : (
              <ul className="divide-y divide-neutral-200">
                {alerts.map((a) => (
                  <li key={a._id} className="px-4 py-2.5 text-sm">
                    <p className="text-neutral-900">{a.message}</p>
                    <p className="text-xs text-neutral-400">
                      {a.status} · {formatTime(a.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-neutral-900">Collection history for this bin</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0">
          {collections === null ? (
            <p className="p-4 text-sm text-neutral-500">Loading…</p>
          ) : collections.length === 0 ? (
            <p className="p-4 text-sm text-neutral-500">No collections recorded for this bin yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {collections.map((c) => (
                <li key={c._id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-neutral-900">Collected at {c.levelBeforeCollection}%</span>
                  <span className="text-neutral-500">{c.completedAt ? formatTime(c.completedAt) : formatTime(c.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
