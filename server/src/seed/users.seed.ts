import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { UserRole } from '../types/enums.js'

// Demo accounts for one of each role, for local development and academic
// demonstration (PROJECT_MEMORY.md Section 32). Staff/Admin are seeded
// because there was no other way to create them before Stage 38 (User
// Management) existed; now that it does, an Admin can create real ones from
// /admin/users — this seed just guarantees a working login on first run.
// Clearly demo credentials, never used for a real deployment; documented in
// docs/DEMO_ACCOUNTS.md.
const DEMO_PASSWORD = 'Password123!'

const DEMO_ACCOUNTS = [
  // Address matches the house bin bins.seed.ts assigns to this account, so
  // the demo shows a resident whose registered address and installed bin
  // agree, the way a real household would.
  { name: 'NISEPA Public', email: 'public@nisepa.test', role: UserRole.PUBLIC, address: 'No. 12 Bosso Close, Minna, Niger State' },
  { name: 'NISEPA Staff', email: 'staff@nisepa.test', role: UserRole.STAFF },
  { name: 'NISEPA Admin', email: 'admin@nisepa.test', role: UserRole.ADMIN },
]

export async function seedDemoStaffAccountsIfEmpty(): Promise<void> {
  const existing = await User.countDocuments({ role: { $in: [UserRole.STAFF, UserRole.ADMIN] } })
  if (existing > 0) return

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12)
  await User.insertMany(DEMO_ACCOUNTS.map((a) => ({ ...a, passwordHash })))

  console.log(`[seed] created ${DEMO_ACCOUNTS.length} demo accounts, one per role (see docs/DEMO_ACCOUNTS.md)`)
}
