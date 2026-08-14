export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold text-neutral-900 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm font-bold text-white">
        N
      </span>
      <span>NISEPA SmartBin</span>
    </span>
  )
}
