const thresholds = [
  {
    label: 'Normal',
    range: '0–79%',
    meaning: 'Continue monitoring. No action needed yet.',
    dot: 'bg-status-normal',
    badgeBg: 'bg-status-normal-bg',
    badgeText: 'text-status-normal',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
      </svg>
    ),
  },
  {
    label: 'Warning',
    range: '80–89%',
    meaning: 'Collection planning recommended.',
    dot: 'bg-status-warning',
    badgeBg: 'bg-status-warning-bg',
    badgeText: 'text-status-warning',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3l9 16H3L12 3Z" />
      </svg>
    ),
  },
  {
    label: 'High Priority',
    range: '90–99%',
    meaning: 'Immediate attention recommended.',
    dot: 'bg-status-high',
    badgeBg: 'bg-status-high-bg',
    badgeText: 'text-status-high',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3l9 16H3L12 3Z" />
      </svg>
    ),
  },
  {
    label: 'Full',
    range: '100%',
    meaning: 'Collection required.',
    dot: 'bg-status-full',
    badgeBg: 'bg-status-full-bg',
    badgeText: 'text-status-full',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    ),
  },
]

export function WasteInfoPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold text-neutral-900">Understanding waste levels</h1>
      <p className="mt-3 max-w-2xl text-neutral-600">
        Every smart bin in the SmartBin network reports a fill level as a percentage. NISEPA uses four
        thresholds to decide when a bin needs attention — the same thresholds you'll see on the smart bin
        display and in staff/admin alerts.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {thresholds.map((t) => (
          <div key={t.label} className="rounded-lg border border-neutral-200 bg-neutral-0 p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
              <span className="text-sm font-semibold text-neutral-900">{t.label}</span>
              <span className={`ml-auto inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${t.badgeBg} ${t.badgeText}`}>
                {t.icon}
                {t.range}
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-600">{t.meaning}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-neutral-200 bg-neutral-0 p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Why it matters</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          A bin that overflows before it's collected creates litter, blocks drainage, and becomes a health
          hazard. By monitoring levels continuously and alerting NISEPA staff at 80%, 90%, and 100% full,
          SmartBin gives the Niger State Environmental Protection Agency time to plan collections before a
          bin becomes a problem — rather than reacting after the fact.
        </p>
      </div>
    </div>
  )
}
