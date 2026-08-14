export function PlaceholderPage({ title, stage }: { title: string; stage: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
      <p className="mt-2 text-neutral-500">Built in {stage}.</p>
    </div>
  )
}
