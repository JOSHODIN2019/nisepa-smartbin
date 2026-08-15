import { useState, type FormEvent } from 'react'
import { binsApi } from '@/features/bins/api'
import { useLiveBins } from '@/features/bins/useLiveBins'
import type { WasteBin } from '@/features/bins/types'
import { BinMonitoringTable } from '@/components/BinMonitoringTable'
import { FormField } from '@/components/FormField'
import { ApiClientError } from '@/features/auth/AuthContext'

function CreateBinForm({ onCreated }: { onCreated: (bin: WasteBin) => void }) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [capacityLiters, setCapacityLiters] = useState('240')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const { bin } = await binsApi.create({ code, name, address, capacityLiters: Number(capacityLiters) })
      onCreated(bin)
      setCode('')
      setName('')
      setAddress('')
      setCapacityLiters('240')
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not create the bin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-neutral-200 bg-neutral-0 p-5">
      <h2 className="text-sm font-semibold text-neutral-900">Register a new bin</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField id="bin-code" label="Bin code" placeholder="NISEPA-BIN-006" required value={code} onChange={(e) => setCode(e.target.value)} />
        <FormField id="bin-name" label="Name" placeholder="e.g. GRA Estate" required value={name} onChange={(e) => setName(e.target.value)} />
        <FormField id="bin-address" label="Address" placeholder="Minna, Niger State" required value={address} onChange={(e) => setAddress(e.target.value)} />
        <FormField
          id="bin-capacity"
          label="Capacity (liters)"
          type="number"
          min={1}
          required
          value={capacityLiters}
          onChange={(e) => setCapacityLiters(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-md bg-status-full-bg px-3 py-2 text-sm text-status-full">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {isSubmitting ? 'Creating…' : 'Create bin'}
      </button>
    </form>
  )
}

export function AdminBinsPage() {
  const { bins, setBins } = useLiveBins()

  function handleCreated(bin: WasteBin) {
    setBins((prev) => (prev ? [bin, ...prev] : [bin]))
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    const { bin } = await binsApi.update(id, { isActive: !isActive })
    setBins((prev) => prev?.map((b) => (b.id === id ? bin : b)) ?? prev)
  }

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Bin management</h1>
      <p className="mt-1 text-neutral-500">Register new bins and deactivate ones no longer in service.</p>

      <div className="mt-6">
        <CreateBinForm onCreated={handleCreated} />
      </div>

      <div className="mt-6">
        {bins === null ? (
          <p className="text-sm text-neutral-500">Loading bins…</p>
        ) : (
          <BinMonitoringTable bins={bins} detailBasePath="/admin" onToggleActive={handleToggleActive} />
        )}
      </div>
    </div>
  )
}
