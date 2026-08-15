import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/StatusBadge'
import type { WasteBin } from '@/features/bins/types'
import type { ManagedUser } from '@/features/users/types'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function BinMonitoringTable({
  bins,
  detailBasePath,
  onToggleActive,
  residents,
  onAssign,
}: {
  bins: WasteBin[]
  detailBasePath?: '/staff' | '/admin'
  onToggleActive?: (id: string, isActive: boolean) => void
  // When provided (admin context only), a residence bin's row gets an inline
  // "assign resident" control — covers the case where NISEPA installs a bin
  // before or independently of a resident creating their account, and the
  // two need to be linked later rather than only at bin-creation time.
  residents?: ManagedUser[]
  onAssign?: (binId: string, userId: string | null) => void
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
            <th className="px-4 py-3">Type</th>
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
              <td className="px-4 py-3">
                {bin.locationType === 'house' ? (
                  <div className="flex flex-col items-start gap-1">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                      Residence{bin.assignedUserName ? ` · ${bin.assignedUserName}` : ' · unassigned'}
                    </span>
                    {onAssign && (
                      <select
                        aria-label={`Assign resident to ${bin.name}`}
                        value={bin.assignedUserId ?? ''}
                        onChange={(e) => onAssign(bin.id, e.target.value || null)}
                        className="rounded-md border border-neutral-300 bg-neutral-0 px-1.5 py-1 text-xs text-neutral-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="">Unassigned</option>
                        {residents?.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                            {u.address ? ` — ${u.address}` : ''} ({u.email})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                    Roadside
                  </span>
                )}
              </td>
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
