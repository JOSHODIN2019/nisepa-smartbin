import { useEffect, useState } from 'react'
import { reportsApi } from '@/features/reports/api'
import type { Report } from '@/features/reports/types'
import { StatTile } from '@/components/StatTile'

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

function ReportDetail({ report }: { report: Report }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-0 p-5">
      <h3 className="text-sm font-semibold text-neutral-900">{report.title}</h3>
      <p className="text-xs text-neutral-500">
        Generated {formatTime(report.createdAt)} by {typeof report.generatedBy === 'string' ? report.generatedBy : report.generatedBy.name}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatTile label="Total collections" value={report.data.totalCollections} accentBg="bg-neutral-100" accentDot="bg-neutral-400" />
        <StatTile
          label="Estimated liters collected"
          value={report.data.estimatedLitersCollected}
          accentBg="bg-status-normal-bg"
          accentDot="bg-status-normal"
        />
      </div>

      {report.data.byBin.length > 0 && (
        <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-xs font-medium uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-2">Bin</th>
                <th className="px-4 py-2">Collections</th>
                <th className="px-4 py-2">Estimated liters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {report.data.byBin.map((b) => (
                <tr key={b.binCode}>
                  <td className="px-4 py-2 text-neutral-900">
                    {b.binName} <span className="text-xs text-neutral-500">({b.binCode})</span>
                  </td>
                  <td className="px-4 py-2 tabular-nums text-neutral-700">{b.collections}</td>
                  <td className="px-4 py-2 tabular-nums text-neutral-700">{b.estimatedLiters}L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-neutral-500">
        "Estimated liters" is derived from each bin's fill percentage at collection time × its rated capacity — an estimate, not a real
        weight/volume sensor reading (this is a simulated prototype).
      </p>
    </div>
  )
}

export function AdminReportsPage() {
  const [reports, setReports] = useState<Report[] | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    reportsApi.list().then(({ reports }) => {
      setReports(reports)
      if (reports.length > 0) setSelectedId(reports[0]!._id)
    })
  }, [])

  async function handleGenerate() {
    setIsGenerating(true)
    try {
      const { report } = await reportsApi.generate()
      setReports((prev) => (prev ? [report, ...prev] : [report]))
      setSelectedId(report._id)
    } finally {
      setIsGenerating(false)
    }
  }

  const selected = reports?.find((r) => r._id === selectedId) ?? null

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Reports</h1>
          <p className="mt-1 text-neutral-500">Generate a collections summary from real collection data.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isGenerating ? 'Generating…' : 'Generate report'}
        </button>
      </div>

      {reports === null ? (
        <p className="mt-8 text-sm text-neutral-500">Loading reports…</p>
      ) : reports.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-neutral-200 p-8 text-center">
          <p className="text-sm text-neutral-500">No reports generated yet.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <ul className="divide-y divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-0">
            {reports.map((r) => (
              <li key={r._id}>
                <button
                  onClick={() => setSelectedId(r._id)}
                  className={`block w-full px-4 py-3 text-left text-sm ${
                    r._id === selectedId ? 'bg-brand-50 text-brand-700' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-neutral-500">{formatTime(r.createdAt)}</p>
                </button>
              </li>
            ))}
          </ul>

          {selected && <ReportDetail report={selected} />}
        </div>
      )}
    </div>
  )
}
