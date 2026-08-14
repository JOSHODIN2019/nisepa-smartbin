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
  const email = `settings-admin-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  await User.create({ name: 'Settings Admin', email, passwordHash: await bcrypt.hash('password123', 4), role: 'admin' })
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  return res.headers['set-cookie']
}

describe('settings (Stage 44) — actually drives simulation behavior, not decorative', () => {
  it('defaults to 5-15% and is admin-only to change', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const noAuthRes = await request(app).get('/api/settings')
    expect(noAuthRes.status).toBe(401)

    const cookie = await loginAsAdmin(app, request)
    const res = await request(app).get('/api/settings').set('Cookie', cookie)
    expect(res.status).toBe(200)
    expect(res.body.data.settings.simulatedWasteMinPercent).toBe(5)
    expect(res.body.data.settings.simulatedWasteMaxPercent).toBe(15)
  })

  it('rejects min > max, and a valid update actually changes add-waste behavior', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const request = (await import('supertest')).default
    const app = createApp()
    const cookie = await loginAsAdmin(app, request)

    const badRes = await request(app)
      .patch('/api/settings')
      .set('Cookie', cookie)
      .send({ simulatedWasteMinPercent: 50, simulatedWasteMaxPercent: 10 })
    expect(badRes.status).toBe(400)

    // Pin the range to a single fixed value so the random add is deterministic.
    const updateRes = await request(app)
      .patch('/api/settings')
      .set('Cookie', cookie)
      .send({ simulatedWasteMinPercent: 20, simulatedWasteMaxPercent: 20 })
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.data.settings.simulatedWasteMinPercent).toBe(20)
    // Must be populated in the PATCH response itself, not just a later GET.
    expect(updateRes.body.data.settings.updatedBy.name).toBe('Settings Admin')

    const bin = await WasteBin.create({
      code: 'SETTINGS-BIN-01',
      name: 'Settings Test Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 200,
      currentLevelPercent: 10,
    })
    // No amountPercent in the body -> uses the now-pinned 20% setting.
    const wasteRes = await request(app).post(`/api/bins/${bin.id}/waste`).send({})
    expect(wasteRes.body.data.bin.currentLevelPercent).toBe(30)
  })
})
