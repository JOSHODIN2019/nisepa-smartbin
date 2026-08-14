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

async function loginAsStaff(app: import('express').Express, request: typeof import('supertest')['default']) {
  const { User } = await import('../../server/src/models/User.js')
  const bcrypt = (await import('bcryptjs')).default
  const email = `collector-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  await User.create({ name: 'Collector Staff', email, passwordHash: await bcrypt.hash('password123', 4), role: 'staff' })
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  return res.headers['set-cookie']
}

describe('collections (Stages 35/36/41) — closes the core system loop', () => {
  it('is blocked for public users', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const res = await request(app).get('/api/collections')
    expect(res.status).toBe(401)
  })

  it('recording a collection resets the bin, resolves its alerts, and appears in history', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const request = (await import('supertest')).default
    const app = createApp()
    const cookie = await loginAsStaff(app, request)

    const bin = await WasteBin.create({
      code: 'COLLECT-BIN-01',
      name: 'Collection Test Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 240,
      currentLevelPercent: 70,
    })

    // Push it to Full so an Alert gets raised, to verify collection resolves it.
    await request(app).post(`/api/bins/${bin.id}/waste`).set('Cookie', cookie).send({ amountPercent: 30 })
    const alertsBeforeRes = await request(app).get('/api/alerts').set('Cookie', cookie)
    const alertForBin = alertsBeforeRes.body.data.alerts.find((a: { binId: { _id: string } }) => a.binId._id === bin.id)
    expect(alertForBin.status).toBe('new')

    const collectRes = await request(app)
      .post(`/api/collections/${bin.id}`)
      .set('Cookie', cookie)
      .send({ notes: 'Collected during routine sweep' })
    expect(collectRes.status).toBe(201)
    expect(collectRes.body.data.bin.currentLevelPercent).toBe(0)
    expect(collectRes.body.data.bin.status).toBe('normal')
    // The record returned directly from POST must already be populated —
    // the client renders it immediately without waiting for a GET /collections
    // refetch, so an unpopulated binId/staffId here would show raw ObjectIds.
    expect(collectRes.body.data.record.binId.name).toBe('Collection Test Bin')
    expect(collectRes.body.data.record.staffId.name).toBe('Collector Staff')

    const refreshedBin = await WasteBin.findById(bin.id)
    expect(refreshedBin?.currentLevelPercent).toBe(0)
    expect(refreshedBin?.lastCollectedAt).toBeTruthy()

    const alertsAfterRes = await request(app).get('/api/alerts').set('Cookie', cookie)
    const resolvedAlert = alertsAfterRes.body.data.alerts.find((a: { binId: { _id: string } }) => a.binId._id === bin.id)
    expect(resolvedAlert.status).toBe('resolved')

    const historyRes = await request(app).get('/api/collections').set('Cookie', cookie)
    expect(historyRes.status).toBe(200)
    const record = historyRes.body.data.records.find((r: { binId: { _id: string } }) => r.binId._id === bin.id)
    expect(record.levelBeforeCollection).toBe(100)
    expect(record.notes).toBe('Collected during routine sweep')
  })
})
