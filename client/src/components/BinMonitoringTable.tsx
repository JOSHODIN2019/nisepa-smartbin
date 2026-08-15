import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/StatusBadge'
import type { WasteBin } from '@/features/bins/types'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function BinMonitoringTable({
  bins,
  detailBasePath,
  onToggleActive,
}: {
  bins: WasteBin[]
  detailBasePath?: '/staff' | '/admin'
  onToggleActive?: (id: string, isActive: boolean) => void
}) {
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
            {onToggleActive && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {bins.map((bin) => (
            <tr key={bin.id} className={bin.isActive ? '' : 'opacity-60'}>
              <td className="px-4 py-3">
                {detailBasePath ? (
                  <Link to={`${detailBasePath}/bins/${bin.id}`} className="font-medium text-brand-700 hover:underline">
                    {bin.name}
                  </Link>
                ) : (
                  <p className="font-medium text-neutral-900">{bin.name}</p>
                )}
                <p className="text-xs text-neutral-500">{bin.code}</p>
              </td>
              <td className="px-4 py-3 text-neutral-600">{bin.location.address}</td>
              <td className="px-4 py-3 font-medium tabular-nums text-neutral-900">{bin.currentLevelPercent}%</td>
              <td className="px-4 py-3">
                {bin.isActive ? (
                  <StatusBadge status={bin.status} />
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-neutral-500">{formatTime(bin.updatedAt)}</td>
              {onToggleActive && (
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onToggleActive(bin.id, bin.isActive)}
                    className="text-xs font-medium text-brand-700 hover:underline"
                  >
                    {bin.isActive ? 'Deactivate' : 'Reactivate'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
