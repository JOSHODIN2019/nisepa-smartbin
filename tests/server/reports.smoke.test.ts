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

async function loginAsAdmin(app: import('express').Express, request: typeof import('supertest')['default']) {
  const { User } = await import('../../server/src/models/User.js')
  const bcrypt = (await import('bcryptjs')).default
  const email = `report-admin-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  await User.create({ name: 'Report Admin', email, passwordHash: await bcrypt.hash('password123', 4), role: 'admin' })
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  return res.headers['set-cookie']
}

describe('reports (Stage 42)', () => {
  it('is admin-only', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const res = await request(app).post('/api/reports').send({ type: 'collections-summary' })
    expect(res.status).toBe(401)
  })

  it('generates a collections-summary report from real collection data, not fabricated numbers', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const request = (await import('supertest')).default
    const app = createApp()
    const cookie = await loginAsAdmin(app, request)

    const bin = await WasteBin.create({
      code: 'REPORT-BIN-01',
      name: 'Report Test Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 200,
      currentLevelPercent: 90,
    })
    await request(app).post(`/api/collections/${bin.id}`).set('Cookie', cookie).send({})

    const genRes = await request(app).post('/api/reports').set('Cookie', cookie).send({ type: 'collections-summary' })
    expect(genRes.status).toBe(201)
    // Must be populated in the POST response itself, not just on a later GET —
    // the client renders this immediately without refetching.
    expect(genRes.body.data.report.generatedBy.name).toBe('Report Admin')
    expect(genRes.body.data.report.data.totalCollections).toBeGreaterThanOrEqual(1)
    const binEntry = genRes.body.data.report.data.byBin.find((b: { binCode: string }) => b.binCode === 'REPORT-BIN-01')
    expect(binEntry.collections).toBe(1)
    // 90% of 200L capacity = 180L, computed from the real collection record.
    expect(binEntry.estimatedLiters).toBe(180)

    const listRes = await request(app).get('/api/reports').set('Cookie', cookie)
    expect(listRes.status).toBe(200)
    expect(listRes.body.data.reports.length).toBeGreaterThanOrEqual(1)

    const reportId = genRes.body.data.report._id
    const getRes = await request(app).get(`/api/reports/${reportId}`).set('Cookie', cookie)
    expect(getRes.status).toBe(200)
    expect(getRes.body.data.report.generatedBy.name).toBe('Report Admin')
  })
})
