import type { ReactNode } from 'react'

export function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-lg border border-neutral-200 bg-neutral-0 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700 transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{description}</p>
    </div>
  )
}
