import { useLiveBins } from '@/features/bins/useLiveBins'
import { BinMonitoringTable } from '@/components/BinMonitoringTable'

export function BinMonitoringPage() {
  const { bins } = useLiveBins()

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Bin monitoring</h1>
      <p className="mt-1 text-neutral-500">All registered bins and their current levels, live.</p>

      <div className="mt-6">
        {bins === null ? <p className="text-sm text-neutral-500">Loading bins…</p> : <BinMonitoringTable bins={bins} />}
      </div>
    </div>
  )
}
