import { env } from './config/env.js'
import { connectDatabase } from './config/db.js'
import { createApp } from './app.js'
import { seedDemoBinsIfEmpty } from './seed/bins.seed.js'

async function main() {
  await connectDatabase()
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
