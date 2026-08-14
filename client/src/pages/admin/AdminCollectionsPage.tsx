import { useEffect, useState } from 'react'
import { collectionsApi } from '@/features/collections/api'
import type { CollectionRecord } from '@/features/collections/types'
import { CollectionHistoryTable } from '@/components/CollectionHistoryTable'

export function AdminCollectionsPage() {
  const [records, setRecords] = useState<CollectionRecord[] | null>(null)

  useEffect(() => {
    collectionsApi.list().then(({ records }) => setRecords(records))
  }, [])

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Collection records</h1>
      <p className="mt-1 text-neutral-500">Every collection recorded by staff across the bin network.</p>

      <div className="mt-6">
        {records === null ? <p className="text-sm text-neutral-500">Loading records…</p> : <CollectionHistoryTable records={records} />}
      </div>
    </div>
  )
}
