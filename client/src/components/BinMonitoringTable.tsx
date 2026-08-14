import { StatusBadge } from '@/components/StatusBadge'
import type { WasteBin } from '@/features/bins/types'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function BinMonitoringTable({ bins }: { bins: WasteBin[] }) {
  if (bins.length === 0) {
    return <p className="text-sm text-neutral-500">No bins registered yet.</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-0">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-xs font-medium uppercase tracking-wide text-neutral-500">
            <th className="px-4 py-3">Bin</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Level</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {bins.map((bin) => (
            <tr key={bin.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-neutral-900">{bin.name}</p>
                <p className="text-xs text-neutral-500">{bin.code}</p>
              </td>
              <td className="px-4 py-3 text-neutral-600">{bin.location.address}</td>
              <td className="px-4 py-3 font-medium tabular-nums text-neutral-900">{bin.currentLevelPercent}%</td>
              <td className="px-4 py-3">
                <StatusBadge status={bin.status} />
              </td>
              <td className="px-4 py-3 text-neutral-500">{formatTime(bin.updatedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
