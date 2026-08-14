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

describe('issue report listing (admin dashboard support)', () => {
  it('GET /api/issues and /api/issues/stats are staff/admin-only and reflect real submissions', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { User } = await import('../../server/src/models/User.js')
    const bcrypt = (await import('bcryptjs')).default
    const request = (await import('supertest')).default
    const app = createApp()

    await request(app).post('/api/issues').send({ description: 'Overflowing bin near the roundabout for days now.' })

    const publicRes = await request(app).get('/api/issues')
    expect(publicRes.status).toBe(401)

    await User.create({
      name: 'Admin Demo',
      email: 'admindemo@example.com',
      passwordHash: await bcrypt.hash('password123', 4),
      role: 'admin',
    })
    const loginRes = await request(app).post('/api/auth/login').send({ email: 'admindemo@example.com', password: 'password123' })
    const cookie = loginRes.headers['set-cookie']

    const listRes = await request(app).get('/api/issues').set('Cookie', cookie)
    expect(listRes.status).toBe(200)
    expect(listRes.body.data.reports).toHaveLength(1)

    const statsRes = await request(app).get('/api/issues/stats').set('Cookie', cookie)
    expect(statsRes.status).toBe(200)
    expect(statsRes.body.data.newCount).toBe(1)
  })
})
