import type { ReactNode } from 'react'

export function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-0 p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">{icon}</div>
      <h3 className="mt-4 text-base font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{description}</p>
    </div>
  )
}
