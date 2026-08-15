import { env } from './config/env.js'
import { connectDatabase } from './config/db.js'
import { createApp } from './app.js'
import { seedDemoBinsIfEmpty } from './seed/bins.seed.js'
import { seedDemoStaffAccountsIfEmpty } from './seed/users.seed.js'

async function main() {
  await connectDatabase()
  // Users must be seeded first — bin seeding assigns a demo house bin to the
  // public demo account and needs its ID to already exist.
  await seedDemoStaffAccountsIfEmpty()
  await seedDemoBinsIfEmpty()

  const app = createApp()
  app.listen(env.PORT, () => {
    console.log(`[server] listening on http://localhost:${env.PORT}`)
  })
}

main().catch((err) => {
  console.error('[server] failed to start:', err)
  process.exit(1)
})
