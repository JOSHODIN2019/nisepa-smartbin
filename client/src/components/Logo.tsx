export function Logo({ variant = 'dark', className = '' }: { variant?: 'dark' | 'light'; className?: string }) {
  const textColor = variant === 'light' ? 'text-white' : 'text-neutral-900'
  const badgeStyle = variant === 'light' ? 'bg-white/15 text-white' : 'bg-brand-600 text-white'

  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${textColor} ${className}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold ${badgeStyle}`}>N</span>
      <span>NISEPA SmartBin</span>
    </span>
  )
}
