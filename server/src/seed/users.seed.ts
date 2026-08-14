import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { UserRole } from '../types/enums.js'

// Demo Staff/Admin accounts for local development and academic demonstration
// (PROJECT_MEMORY.md Section 32) — there is no admin User Management UI yet
// (Stage 38) to create these otherwise. Clearly a seed/demo credential, never
// used for a real deployment; documented in docs/DEMO_ACCOUNTS.md.
const DEMO_PASSWORD = 'Password123!'

const DEMO_STAFF_ACCOUNTS = [
  { name: 'NISEPA Staff Demo', email: 'staff@nisepa.demo', role: UserRole.STAFF },
  { name: 'NISEPA Admin Demo', email: 'admin@nisepa.demo', role: UserRole.ADMIN },
]

export async function seedDemoStaffAccountsIfEmpty(): Promise<void> {
  const existing = await User.countDocuments({ role: { $in: [UserRole.STAFF, UserRole.ADMIN] } })
  if (existing > 0) return

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12)
  await User.insertMany(DEMO_STAFF_ACCOUNTS.map((a) => ({ ...a, passwordHash })))

  console.log(`[seed] created ${DEMO_STAFF_ACCOUNTS.length} demo staff/admin accounts (see docs/DEMO_ACCOUNTS.md)`)
}
