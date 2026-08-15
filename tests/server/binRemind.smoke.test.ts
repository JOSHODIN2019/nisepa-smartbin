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

async function createUser(role: 'admin' | 'staff' | 'public', label: string) {
  const { User } = await import('../../server/src/models/User.js')
  const bcrypt = (await import('bcryptjs')).default
  const email = `${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  const user = await User.create({ name: label, email, passwordHash: await bcrypt.hash('password123', 4), role })
  return { id: user.id as string, email }
}

async function login(app: import('express').Express, request: typeof import('supertest')['default'], email: string) {
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  return res.headers['set-cookie']
}

describe('resident "remind NISEPA" reminder for a full house bin', () => {
  it('requires auth', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const res = await request(app).post('/api/bins/000000000000000000000000/remind')
    expect(res.status).toBe(401)
  })

  it('rejects reminding a bin that is not full', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'remind-admin-1')
    const adminCookie = await login(app, request, admin.email)
    const resident = await createUser('public', 'remind-resident-1')

    const createRes = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'REMIND-1',
        name: 'Not Full House Bin',
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: resident.id,
      })
    const binId = createRes.body.data.bin.id

    const residentCookie = await login(app, request, resident.email)
    const remindRes = await request(app).post(`/api/bins/${binId}/remind`).set('Cookie', residentCookie)
    expect(remindRes.status).toBe(400)
    expect(remindRes.body.error.code).toBe('BIN_NOT_FULL')
  })

  it('rejects a reminder from someone who is neither the assigned resident nor staff/admin', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'remind-admin-2')
    const adminCookie = await login(app, request, admin.email)
    const resident = await createUser('public', 'remind-resident-2')
    const otherResident = await createUser('public', 'remind-other-2')

    const createRes = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'REMIND-2',
        name: 'Full House Bin',
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: resident.id,
      })
    const binId = createRes.body.data.bin.id
    await request(app).patch(`/api/bins/${binId}`).set('Cookie', adminCookie).send({}) // no-op, keeps flow explicit
    await mongoose.connection.collection('wastebins').updateOne({ _id: new mongoose.Types.ObjectId(binId) }, { $set: { currentLevelPercent: 100, status: 'full' } })

    const otherCookie = await login(app, request, otherResident.email)
    const remindRes = await request(app).post(`/api/bins/${binId}/remind`).set('Cookie', otherCookie)
    expect(remindRes.status).toBe(403)
  })

  it('lets the assigned resident remind NISEPA, notifying every active staff/admin', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'remind-admin-3')
    const adminCookie = await login(app, request, admin.email)
    const staff = await createUser('staff', 'remind-staff-3')
    const resident = await createUser('public', 'remind-resident-3')

    const createRes = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'REMIND-3',
        name: 'Overflowing House Bin',
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: resident.id,
      })
    const binId = createRes.body.data.bin.id
    await mongoose.connection.collection('wastebins').updateOne({ _id: new mongoose.Types.ObjectId(binId) }, { $set: { currentLevelPercent: 100, status: 'full' } })

    const residentCookie = await login(app, request, resident.email)
    const remindRes = await request(app).post(`/api/bins/${binId}/remind`).set('Cookie', residentCookie)
    expect(remindRes.status).toBe(200)

    const staffCookie = await login(app, request, staff.email)
    const staffNotifs = await request(app).get('/api/notifications').set('Cookie', staffCookie)
    expect(
      staffNotifs.body.data.notifications.some((n: { message: string }) => n.message.includes('Overflowing House Bin')),
    ).toBe(true)

    const adminNotifs = await request(app).get('/api/notifications').set('Cookie', adminCookie)
    expect(
      adminNotifs.body.data.notifications.some((n: { message: string }) => n.message.includes('Overflowing House Bin')),
    ).toBe(true)
  })

  it('rate-limits repeated reminders from the same client', async () => {
    // The limiter (3 per 10 min) is keyed by client IP for the whole /remind
    // route, not per-bin — so its budget is shared across every test in this
    // file, not just this one. Rather than assert an exact "first 3 succeed"
    // count (which would be order-dependent on whatever earlier tests already
    // spent), fire enough requests that a 429 is guaranteed regardless of how
    // much budget remains, and just confirm the limiter actually engages.
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'remind-admin-4')
    const adminCookie = await login(app, request, admin.email)
    const resident = await createUser('public', 'remind-resident-4')

    const createRes = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'REMIND-4',
        name: 'Rate Limited House Bin',
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: resident.id,
      })
    const binId = createRes.body.data.bin.id
    await mongoose.connection.collection('wastebins').updateOne({ _id: new mongoose.Types.ObjectId(binId) }, { $set: { currentLevelPercent: 100, status: 'full' } })

    const residentCookie = await login(app, request, resident.email)
    const statuses: number[] = []
    for (let i = 0; i < 5; i++) {
      const res = await request(app).post(`/api/bins/${binId}/remind`).set('Cookie', residentCookie)
      statuses.push(res.status)
    }
    expect(statuses).toContain(429)
  })
})
