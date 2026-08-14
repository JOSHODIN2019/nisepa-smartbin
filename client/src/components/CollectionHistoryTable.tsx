import type { CollectionRecord } from '@/features/collections/types'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function CollectionHistoryTable({ records }: { records: CollectionRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-200 p-8 text-center">
        <p className="text-sm text-neutral-500">No collections recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-0">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-xs font-medium uppercase tracking-wide text-neutral-500">
            <th className="px-4 py-3">Bin</th>
            <th className="px-4 py-3">Collected by</th>
            <th className="px-4 py-3">Level before</th>
            <th className="px-4 py-3">Notes</th>
            <th className="px-4 py-3">Collected at</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {records.map((r) => {
            const binName = typeof r.binId === 'string' ? r.binId : r.binId.name
            const binLocation = typeof r.binId === 'string' ? null : r.binId.location.address
            const staffName = typeof r.staffId === 'string' ? r.staffId : r.staffId.name
            return (
              <tr key={r._id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-900">{binName}</p>
                  {binLocation && <p className="text-xs text-neutral-500">{binLocation}</p>}
                </td>
                <td className="px-4 py-3 text-neutral-600">{staffName}</td>
                <td className="px-4 py-3 font-medium tabular-nums text-neutral-900">{r.levelBeforeCollection}%</td>
                <td className="px-4 py-3 text-neutral-600">{r.notes || '—'}</td>
                <td className="px-4 py-3 text-neutral-500">{r.completedAt ? formatTime(r.completedAt) : formatTime(r.createdAt)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
