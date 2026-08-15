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
  const email = `levels-staff-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  await User.create({ name: 'Levels Staff', email, passwordHash: await bcrypt.hash('password123', 4), role: 'staff' })
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  return res.headers['set-cookie']
}

describe('bin level history (Stage 32 support)', () => {
  it('is staff/admin-only and reflects real recorded readings, newest first', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const bin = await WasteBin.create({
      code: 'LEVELS-BIN-01',
      name: 'Levels Test Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 200,
      currentLevelPercent: 10,
    })

    const noAuthRes = await request(app).get(`/api/bins/${bin.id}/levels`)
    expect(noAuthRes.status).toBe(401)

    const cookie = await loginAsStaff(app, request)
    await request(app).post(`/api/bins/${bin.id}/waste`).set('Cookie', cookie).send({ amountPercent: 10 })
    await request(app).post(`/api/bins/${bin.id}/waste`).set('Cookie', cookie).send({ amountPercent: 10 })

    const res = await request(app).get(`/api/bins/${bin.id}/levels`).set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.data.levels).toHaveLength(2)
    expect(res.body.data.levels[0].levelPercent).toBe(30) // newest first
    expect(res.body.data.levels[1].levelPercent).toBe(20)

    const missingRes = await request(app).get('/api/bins/64b64b64b64b64b64b64b64b/levels').set('Cookie', cookie)
    expect(missingRes.status).toBe(404)
  })
})
