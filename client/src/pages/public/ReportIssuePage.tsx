import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FormField } from '@/components/FormField'
import { issuesApi } from '@/features/issues/api'
import { ApiClientError } from '@/features/auth/AuthContext'

export function ReportIssuePage() {
  const [description, setDescription] = useState('')
  const [locationText, setLocationText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await issuesApi.create({ description, locationText: locationText || undefined })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-status-normal-bg text-status-normal">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-neutral-900">Report received</h1>
        <p className="mt-2 text-neutral-600">
          Your report has been recorded in NISEPA's system for review.
        </p>
        <Link to="/" className="mt-6 inline-block rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-2xl font-semibold text-neutral-900">Report a waste issue</h1>
      <p className="mt-1 text-sm text-neutral-500">
        See an overflowing bin, illegal dumping, or another waste problem? Let NISEPA know.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <FormField
          id="locationText"
          label="Location (optional)"
          type="text"
          placeholder="e.g. Behind Tunga Low Cost market"
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
            What's the issue?
          </label>
          <textarea
            id="description"
            required
            minLength={10}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <p className="mt-1 text-xs text-neutral-500">At least 10 characters.</p>
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-status-full-bg px-3 py-2 text-sm text-status-full">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting…' : 'Submit report'}
        </button>
      </form>
    </div>
  )
}
