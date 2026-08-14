import { env } from './config/env.js'
import { connectDatabase } from './config/db.js'
import { createApp } from './app.js'

async function main() {
  await connectDatabase()

  const app = createApp()
  app.listen(env.PORT, () => {
    console.log(`[server] listening on http://localhost:${env.PORT}`)
  })
}

main().catch((err) => {
  console.error('[server] failed to start:', err)
  process.exit(1)
})
