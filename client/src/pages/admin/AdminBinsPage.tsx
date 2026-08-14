import { useEffect, useState } from 'react'
import { binsApi } from '@/features/bins/api'
import type { WasteBin } from '@/features/bins/types'
import { BinMonitoringTable } from '@/components/BinMonitoringTable'

export function AdminBinsPage() {
  const [bins, setBins] = useState<WasteBin[] | null>(null)

  useEffect(() => {
    binsApi.list().then(({ bins }) => setBins(bins))
  }, [])

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Bin management</h1>
      <p className="mt-1 text-neutral-500">
        All registered bins. Creating, editing, and deactivating bins isn't built yet — this is a read-only view for now.
      </p>

      <div className="mt-6">
        {bins === null ? <p className="text-sm text-neutral-500">Loading bins…</p> : <BinMonitoringTable bins={bins} />}
      </div>
    </div>
  )
}
