import { useEffect, useState, type FormEvent } from 'react'
import { settingsApi } from '@/features/settings/api'
import type { SystemSettings } from '@/features/settings/types'
import { FormField } from '@/components/FormField'
import { ApiClientError } from '@/features/auth/AuthContext'

export function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [minPercent, setMinPercent] = useState('5')
  const [maxPercent, setMaxPercent] = useState('15')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    settingsApi.get().then(({ settings }) => {
      setSettings(settings)
      setMinPercent(String(settings.simulatedWasteMinPercent))
      setMaxPercent(String(settings.simulatedWasteMaxPercent))
    })
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSaving(true)
    try {
      const { settings } = await settingsApi.update({
        simulatedWasteMinPercent: Number(minPercent),
        simulatedWasteMaxPercent: Number(maxPercent),
      })
      setSettings(settings)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not save settings.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">Settings</h1>
      <p className="mt-1 text-neutral-500">System-wide configuration for the waste simulation.</p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-lg rounded-lg border border-neutral-200 bg-neutral-0 p-5">
        <h2 className="text-sm font-semibold text-neutral-900">Simulated waste per interaction</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Each time a public visitor clicks "Add simulated waste" without specifying an amount, the bin's level rises by a
          random percentage in this range. This is the one part of the IoT simulation currently configurable — it does not
          change the fixed 80% / 90% / 100% alert thresholds.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <FormField
            id="min-percent"
            label="Minimum %"
            type="number"
            min={1}
            max={100}
            required
            value={minPercent}
            onChange={(e) => setMinPercent(e.target.value)}
          />
          <FormField
            id="max-percent"
            label="Maximum %"
            type="number"
            min={1}
            max={100}
            required
            value={maxPercent}
            onChange={(e) => setMaxPercent(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="mt-3 rounded-md bg-status-full-bg px-3 py-2 text-sm text-status-full">
            {error}
          </p>
        )}
        {success && (
          <p role="status" className="mt-3 rounded-md bg-status-normal-bg px-3 py-2 text-sm text-status-normal">
            Settings saved.
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isSaving ? 'Saving…' : 'Save settings'}
        </button>

        {settings?.updatedAt && (
          <p className="mt-3 text-xs text-neutral-400">
            Last updated {new Date(settings.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            {typeof settings.updatedBy === 'object' && settings.updatedBy ? ` by ${settings.updatedBy.name}` : ''}
          </p>
        )}
      </form>
    </div>
  )
}
