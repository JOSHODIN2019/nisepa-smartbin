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

describe('auth + RBAC (Stage 08 & 09)', () => {
  it('registers a public user, rejects duplicate email, and logs in', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Amaka Public', email: 'amaka@example.com', password: 'password123', address: '14 Tunga Road, Minna' })
    expect(registerRes.status).toBe(201)
    expect(registerRes.body.data.user.role).toBe('public')
    expect(registerRes.body.data.user.address).toBe('14 Tunga Road, Minna')
    const cookie = registerRes.headers['set-cookie']
    expect(cookie).toBeDefined()

    const dupeRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Amaka Again', email: 'amaka@example.com', password: 'password123', address: '14 Tunga Road, Minna' })
    expect(dupeRes.status).toBe(409)
    expect(dupeRes.body.error.code).toBe('EMAIL_IN_USE')

    const noAddressRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'No Address', email: 'noaddress@example.com', password: 'password123' })
    expect(noAddressRes.status).toBe(400)

    const badLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'amaka@example.com', password: 'wrong-password' })
    expect(badLoginRes.status).toBe(401)

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'amaka@example.com', password: 'password123' })
    expect(loginRes.status).toBe(200)

    const meRes = await request(app).get('/api/auth/me').set('Cookie', cookie)
    expect(meRes.status).toBe(200)
    expect(meRes.body.data.user.email).toBe('amaka@example.com')
    expect(meRes.body.data.user.address).toBe('14 Tunga Road, Minna')

    const meNoCookieRes = await request(app).get('/api/auth/me')
    expect(meNoCookieRes.status).toBe(401)

    const logoutRes = await request(app).post('/api/auth/logout').set('Cookie', cookie)
    expect(logoutRes.status).toBe(200)
  })

  it('blocks non-staff/admin roles from role-gated routes', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { requireAuth } = await import('../../server/src/middleware/auth.middleware.js')
    const { requireRole } = await import('../../server/src/middleware/rbac.middleware.js')
    const { errorHandler } = await import('../../server/src/middleware/errorHandler.js')
    const request = (await import('supertest')).default
    const express = (await import('express')).default
    const cookieParser = (await import('cookie-parser')).default

    const app = createApp()

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Public Only', email: 'publiconly@example.com', password: 'password123', address: '1 Chanchaga Road, Minna' })
    const cookie = registerRes.headers['set-cookie']

    // Standalone probe app to exercise requireAuth + requireRole directly,
    // since no real staff-only route exists yet (added in Stage 30+). Built
    // separately from createApp() so it isn't shadowed by the catch-all 404
    // handler that createApp() already registers.
    const probeApp = express()
    probeApp.use(cookieParser())
    probeApp.get('/staff-only', requireAuth, requireRole('staff', 'admin'), (_req, res) => {
      res.json({ success: true, data: { ok: true } })
    })
    probeApp.use(errorHandler)

    const forbiddenRes = await request(probeApp).get('/staff-only').set('Cookie', cookie)
    expect(forbiddenRes.status).toBe(403)

    const noAuthRes = await request(probeApp).get('/staff-only')
    expect(noAuthRes.status).toBe(401)
  })
})
