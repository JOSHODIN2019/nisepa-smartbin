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

async function makeStaffCookie(app: import('express').Express, request: typeof import('supertest')['default'], email: string) {
  const { User } = await import('../../server/src/models/User.js')
  const bcrypt = (await import('bcryptjs')).default
  await User.create({ name: 'Staff Member', email, passwordHash: await bcrypt.hash('password123', 4), role: 'staff' })
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  return res.headers['set-cookie']
}

describe('alert engine (Stage 27) + alert API', () => {
  it('creates an Alert on threshold crossing, visible only to staff/admin', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const bin = await WasteBin.create({
      code: 'ALERT-BIN-01',
      name: 'Alert Test Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 240,
      currentLevelPercent: 70,
    })

    // Public (unauthenticated) request still raises a staff-facing alert.
    await request(app).post(`/api/bins/${bin.id}/waste`).send({ amountPercent: 15 })

    const publicRes = await request(app).get('/api/alerts')
    expect(publicRes.status).toBe(401)

    const staffCookie = await makeStaffCookie(app, request, 'staffmember@example.com')
    const staffRes = await request(app).get('/api/alerts').set('Cookie', staffCookie)
    expect(staffRes.status).toBe(200)
    expect(staffRes.body.data.alerts).toHaveLength(1)
    expect(staffRes.body.data.alerts[0].threshold).toBe(80)
    expect(staffRes.body.data.alerts[0].status).toBe('new')

    const alertId = staffRes.body.data.alerts[0]._id
    const ackRes = await request(app).patch(`/api/alerts/${alertId}/acknowledge`).set('Cookie', staffCookie)
    expect(ackRes.status).toBe(200)
    expect(ackRes.body.data.alert.status).toBe('acknowledged')

    const resolveRes = await request(app).patch(`/api/alerts/${alertId}/resolve`).set('Cookie', staffCookie)
    expect(resolveRes.status).toBe(200)
    expect(resolveRes.body.data.alert.status).toBe('resolved')
  })

  it('a public-role user cannot access alerts', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Public Guy', email: 'publicguy@example.com', password: 'password123', address: '5 Public Guy Street, Minna' })
    const cookie = registerRes.headers['set-cookie']

    const res = await request(app).get('/api/alerts').set('Cookie', cookie)
    expect(res.status).toBe(403)
  })
})
