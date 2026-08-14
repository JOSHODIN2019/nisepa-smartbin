import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongod: MongoMemoryServer

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()
  process.env.JWT_SECRET = 'test-secret-at-least-32-characters-long'
  await mongoose.connect(mongod.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

describe('bin API (Stages 17-19)', () => {
  it('lists bins, fetches one by id, and rejects a malformed id', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const bin = await WasteBin.create({
      code: 'TEST-BIN-01',
      name: 'Test Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 240,
      currentLevelPercent: 70,
    })

    const listRes = await request(app).get('/api/bins')
    expect(listRes.status).toBe(200)
    expect(listRes.body.data.bins).toHaveLength(1)
    expect(listRes.body.data.bins[0].status).toBe('normal')

    const getRes = await request(app).get(`/api/bins/${bin.id}`)
    expect(getRes.status).toBe(200)
    expect(getRes.body.data.bin.currentLevelPercent).toBe(70)

    const badIdRes = await request(app).get('/api/bins/not-a-valid-id')
    expect(badIdRes.status).toBe(400)
    expect(badIdRes.body.error.code).toBe('INVALID_ID')

    const missingRes = await request(app).get('/api/bins/64b64b64b64b64b64b64b64b')
    expect(missingRes.status).toBe(404)
  })

  it('adding waste increases the level, updates status, and records history', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const { WasteLevel } = await import('../../server/src/models/WasteLevel.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const bin = await WasteBin.create({
      code: 'TEST-BIN-02',
      name: 'Threshold Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 240,
      currentLevelPercent: 75,
    })

    const res = await request(app).post(`/api/bins/${bin.id}/waste`).send({ amountPercent: 10 })
    expect(res.status).toBe(200)
    expect(res.body.data.bin.currentLevelPercent).toBe(85)
    expect(res.body.data.bin.status).toBe('warning')

    const levels = await WasteLevel.find({ binId: bin.id })
    expect(levels).toHaveLength(1)
    expect(levels[0]!.levelPercent).toBe(85)

    // Clamps at 100 instead of overflowing.
    const res2 = await request(app).post(`/api/bins/${bin.id}/waste`).send({ amountPercent: 50 })
    expect(res2.body.data.bin.currentLevelPercent).toBe(100)
    expect(res2.body.data.bin.status).toBe('full')
  })
})
