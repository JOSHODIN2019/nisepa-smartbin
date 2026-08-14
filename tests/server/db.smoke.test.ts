import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

// Smoke test for Stage 05 (connection) + Stage 06 (schema). Uses an in-memory
// MongoDB instance so it runs without real Atlas credentials; production still
// targets MongoDB Atlas per PROJECT_MEMORY.md Section 36.1.
let mongod: MongoMemoryServer

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

describe('database connection and schema', () => {
  it('connects successfully', () => {
    expect(mongoose.connection.readyState).toBe(1)
  })

  it('creates a User, WasteBin, WasteLevel, and Alert with expected defaults', async () => {
    const { User } = await import('../../server/src/models/User.js')
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const { WasteLevel } = await import('../../server/src/models/WasteLevel.js')
    const { Alert } = await import('../../server/src/models/Alert.js')

    const user = await User.create({
      name: 'Test Staff',
      email: 'staff@nisepa.test',
      passwordHash: 'hashed',
      role: 'staff',
    })
    expect(user.role).toBe('staff')

    const bin = await WasteBin.create({
      code: 'NISEPA-BIN-TEST',
      name: 'Test Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 100,
    })
    expect(bin.status).toBe('normal')
    expect(bin.currentLevelPercent).toBe(0)

    const level = await WasteLevel.create({ binId: bin._id, levelPercent: 82 })
    expect(level.source).toBe('simulated_sensor')

    const alert = await Alert.create({
      binId: bin._id,
      threshold: 80,
      message: 'Bin reached 80% — warning threshold',
    })
    expect(alert.status).toBe('new')
  })
})
