import { useEffect, useState, type FormEvent } from 'react'
import { useAuth, ApiClientError } from '@/features/auth/AuthContext'
import { usersApi } from '@/features/users/api'
import type { ManagedUser } from '@/features/users/types'
import { FormField } from '@/components/FormField'

const ROLE_LABEL: Record<string, string> = { public: 'Public', staff: 'Staff', admin: 'Admin' }

function CreateUserForm({ onCreated }: { onCreated: (user: ManagedUser) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'staff' | 'admin'>('staff')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const { user } = await usersApi.create({ name, email, password, role })
      onCreated(user)
      setName('')
      setEmail('')
      setPassword('')
      setRole('staff')
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Could not create the account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-neutral-200 bg-neutral-0 p-5">
      <h2 className="text-sm font-semibold text-neutral-900">Add a staff or admin account</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField id="new-name" label="Full name" required value={name} onChange={(e) => setName(e.target.value)} />
        <FormField id="new-email" label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <FormField
          id="new-password"
          label="Temporary password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <label htmlFor="new-role" className="block text-sm font-medium text-neutral-700">
            Role
          </label>
          <select
            id="new-role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'staff' | 'admin')}
            className="mt-1 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm shadow-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
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
        {isSubmitting ? 'Creating…' : 'Create account'}
      </button>
    </form>
  )
}

export function UserManagementPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<ManagedUser[] | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  useEffect(() => {
    usersApi.list().then(({ users }) => setUsers(users))
  }, [])

  function handleCreated(user: ManagedUser) {
    setUsers((prev) => (prev ? [user, ...prev] : [user]))
  }

  async function handleRoleChange(id: string, role: string) {
    setPendingId(id)
    try {
      const { user } = await usersApi.update(id, { role })
      setUsers((prev) => prev?.map((u) => (u.id === id ? user : u)) ?? prev)
    } catch {
      // Reverting is unnecessary — the <select> re-renders from state, which
      // only changes once the request actually succeeds.
    } finally {
      setPendingId(null)
    }
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    setPendingId(id)
    try {
      const { user } = await usersApi.update(id, { isActive: !isActive })
      setUsers((prev) => prev?.map((u) => (u.id === id ? user : u)) ?? prev)
    } catch {
      // no-op — UI simply doesn't change if the request failed
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="px-8 py-8">
      <h1 className="text-2xl font-semibold text-neutral-900">User management</h1>
      <p className="mt-1 text-neutral-500">Create Staff/Admin accounts and manage roles and access.</p>

      <div className="mt-6">
        <CreateUserForm onCreated={handleCreated} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-xs font-medium uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {users === null ? (
              <tr>
                <td className="px-4 py-3 text-neutral-500" colSpan={5}>
                  Loading users…
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelf = u.id === currentUser?.id
                const isPending = pendingId === u.id
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      {u.name}
                      {isSelf && <span className="ml-2 text-xs font-normal text-neutral-400">(you)</span>}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                    <td className="px-4 py-3">
                      {u.role === 'public' ? (
                        ROLE_LABEL[u.role]
                      ) : (
                        <select
                          value={u.role}
                          disabled={isSelf || isPending}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="rounded-md border border-neutral-200 px-2 py-1 text-sm disabled:opacity-50"
                        >
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          u.isActive ? 'bg-status-normal-bg text-status-normal' : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggleActive(u.id, u.isActive)}
                        disabled={isSelf || isPending}
                        className="text-xs font-medium text-brand-700 hover:underline disabled:cursor-not-allowed disabled:text-neutral-300 disabled:no-underline"
                      >
                        {u.isActive ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
