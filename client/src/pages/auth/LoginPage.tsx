import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth, ApiClientError } from '@/features/auth/AuthContext'
import type { UserRole } from '@/features/auth/types'
import { FormField } from '@/components/FormField'

// A `from` path can be stale relative to who just logged in — e.g. someone
// browses to /admin/dashboard while logged out (redirected to /login with
// that path recorded), then logs in with a public account. Blindly honoring
// `from` would send them to a route RequireAuth immediately bounces them out
// of (landing on "/", not their own dashboard). Only trust `from` when the
// authenticated user's role could actually land there.
function isPathAllowedForRole(path: string, role: UserRole): boolean {
  if (path === '/dashboard') return true // shared public dashboard route, open to every role
  if (role === 'admin') return path.startsWith('/admin')
  if (role === 'staff') return path.startsWith('/staff')
  return !path.startsWith('/admin') && !path.startsWith('/staff')
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const user = await login(email, password)
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname
      const fallback = user.role === 'admin' ? '/admin/dashboard' : user.role === 'staff' ? '/staff/dashboard' : '/dashboard'
      const destination = from && isPathAllowedForRole(from, user.role) ? from : fallback
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-neutral-900">Log in</h1>
      <p className="mt-1 text-sm text-neutral-500">Access your SmartBin account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <FormField
          id="email"
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-brand-700 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
