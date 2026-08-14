export function StatTile({
  label,
  value,
  accentBg,
  accentDot,
}: {
  label: string
  value: number
  accentBg: string
  accentDot: string
}) {
  return (
    <div className={`rounded-lg border border-neutral-200 p-5 ${accentBg}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${accentDot}`} />
        <span className="text-sm font-medium text-neutral-600">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-semibold text-neutral-900">{value}</p>
    </div>
  )
}
