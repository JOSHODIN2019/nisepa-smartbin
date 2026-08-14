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
  const email = `audit-admin-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  await User.create({ name: 'Audit Admin', email, passwordHash: await bcrypt.hash('password123', 4), role: 'admin' })
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  return res.headers['set-cookie']
}

describe('audit log / system activity (Stage 43)', () => {
  it('is admin-only', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const res = await request(app).get('/api/activity')
    expect(res.status).toBe(401)
  })

  it('records a real entry when an admin creates a bin', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()
    const cookie = await loginAsAdmin(app, request)

    await request(app)
      .post('/api/bins')
      .set('Cookie', cookie)
      .send({ code: 'AUDIT-BIN-01', name: 'Audit Test Bin', address: 'Minna, Niger State', capacityLiters: 150 })

    const res = await request(app).get('/api/activity').set('Cookie', cookie)
    expect(res.status).toBe(200)
    const entry = res.body.data.logs.find((l: { action: string }) => l.action === 'bin.create')
    expect(entry).toBeDefined()
    expect(entry.userId.name).toBe('Audit Admin')
    expect(entry.targetType).toBe('WasteBin')
  })
})
