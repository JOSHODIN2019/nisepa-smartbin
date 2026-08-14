import { MongoMemoryServer } from 'mongodb-memory-server'
import { writeFileSync } from 'node:fs'

const mongod = await MongoMemoryServer.create()
const uri = mongod.getUri()
writeFileSync(new URL('./dev-mongo-uri.txt', import.meta.url), uri)
console.log(uri)

process.on('SIGTERM', async () => {
  await mongod.stop()
  process.exit(0)
})
