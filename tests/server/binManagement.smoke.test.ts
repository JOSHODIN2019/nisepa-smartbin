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
  const email = `bin-admin-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  await User.create({ name: 'Bin Admin', email, passwordHash: await bcrypt.hash('password123', 4), role: 'admin' })
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  return res.headers['set-cookie']
}

describe('bin management CRUD (Stage 39, admin-only)', () => {
  it('rejects create/update from public and staff roles', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const res = await request(app)
      .post('/api/bins')
      .send({ code: 'X-1', name: 'X', address: 'Minna', capacityLiters: 100 })
    expect(res.status).toBe(401)
  })

  it('creates a bin, rejects a duplicate code, updates it, deactivates it, and hides it from public listing', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()
    const cookie = await loginAsAdmin(app, request)

    const createRes = await request(app)
      .post('/api/bins')
      .set('Cookie', cookie)
      .send({ code: 'NEW-BIN-01', name: 'Test Estate', address: 'Minna, Niger State', capacityLiters: 200 })
    expect(createRes.status).toBe(201)
    expect(createRes.body.data.bin.status).toBe('normal')
    expect(createRes.body.data.bin.currentLevelPercent).toBe(0)
    const binId = createRes.body.data.bin.id

    const dupeRes = await request(app)
      .post('/api/bins')
      .set('Cookie', cookie)
      .send({ code: 'NEW-BIN-01', name: 'Another', address: 'Minna', capacityLiters: 100 })
    expect(dupeRes.status).toBe(409)
    expect(dupeRes.body.error.code).toBe('BIN_CODE_IN_USE')

    const updateRes = await request(app)
      .patch(`/api/bins/${binId}`)
      .set('Cookie', cookie)
      .send({ name: 'Renamed Estate', capacityLiters: 300 })
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.data.bin.name).toBe('Renamed Estate')
    expect(updateRes.body.data.bin.capacityLiters).toBe(300)

    // Public (unauthenticated) listing excludes inactive bins.
    const deactivateRes = await request(app).patch(`/api/bins/${binId}`).set('Cookie', cookie).send({ isActive: false })
    expect(deactivateRes.status).toBe(200)
    expect(deactivateRes.body.data.bin.isActive).toBe(false)

    const publicListRes = await request(app).get('/api/bins')
    expect(publicListRes.body.data.bins.find((b: { id: string }) => b.id === binId)).toBeUndefined()

    // Admin listing still includes it (so it can be reactivated).
    const adminListRes = await request(app).get('/api/bins').set('Cookie', cookie)
    expect(adminListRes.body.data.bins.find((b: { id: string }) => b.id === binId)).toBeDefined()
  })
})
