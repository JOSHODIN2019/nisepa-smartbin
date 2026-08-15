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

describe('house-bin ownership (public dashboard shows only the resident\'s own bin)', () => {
  it('rejects assigning a house bin to a non-public user', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'owner-admin-1')
    const adminCookie = await login(app, request, admin.email)
    const staffUser = await createUser('staff', 'owner-staff-1')

    const res = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'HOUSE-BAD-1',
        name: 'Bad Assignment',
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: staffUser.id,
      })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('INVALID_BIN_ASSIGNMENT')
  })

  it('creates a house bin assigned to a public user, populated with their name', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'owner-admin-2')
    const adminCookie = await login(app, request, admin.email)
    const resident = await createUser('public', 'owner-resident-2')

    const res = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'HOUSE-OK-1',
        name: 'No. 4 Test Close',
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: resident.id,
      })
    expect(res.status).toBe(201)
    expect(res.body.data.bin.locationType).toBe('house')
    expect(res.body.data.bin.assignedUserId).toBe(resident.id)
    expect(res.body.data.bin.assignedUserName).toBe('owner-resident-2')
  })

  it('ignores a submitted assignedUserId on a roadside bin — never assigned', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'owner-admin-3')
    const adminCookie = await login(app, request, admin.email)
    const resident = await createUser('public', 'owner-resident-3')

    const res = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'ROADSIDE-1',
        name: 'Market Junction',
        address: 'Minna',
        capacityLiters: 240,
        locationType: 'roadside',
        assignedUserId: resident.id,
      })
    expect(res.status).toBe(201)
    expect(res.body.data.bin.locationType).toBe('roadside')
    expect(res.body.data.bin.assignedUserId).toBeNull()
  })

  it('GET /api/bins/mine requires auth', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const res = await request(app).get('/api/bins/mine')
    expect(res.status).toBe(401)
  })

  it("a resident's dashboard sees only their own house bin — not other residents' bins, not roadside bins", async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'owner-admin-4')
    const adminCookie = await login(app, request, admin.email)
    const residentA = await createUser('public', 'owner-resident-a4')
    const residentB = await createUser('public', 'owner-resident-b4')

    await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'ROADSIDE-4',
        name: 'Shared Roadside Bin',
        address: 'Minna',
        capacityLiters: 240,
        locationType: 'roadside',
      })
    const houseARes = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'HOUSE-4A',
        name: "Resident A's House",
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: residentA.id,
      })
    await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'HOUSE-4B',
        name: "Resident B's House",
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: residentB.id,
      })

    const residentACookie = await login(app, request, residentA.email)
    const mineRes = await request(app).get('/api/bins/mine').set('Cookie', residentACookie)
    expect(mineRes.status).toBe(200)
    expect(mineRes.body.data.bins).toHaveLength(1)
    expect(mineRes.body.data.bins[0].id).toBe(houseARes.body.data.bin.id)
    // Regression: /mine is deliberately unpopulated (its own ID is already
    // known), but the caller's own assignedUserId must still come back
    // correctly — not silently nulled out because the ref isn't populated.
    expect(mineRes.body.data.bins[0].assignedUserId).toBe(residentA.id)

    // But the public Smart Bin listing still shows everything, to everyone,
    // logged in or not — the shared network view is never filtered by owner.
    const allBinsAsResidentA = await request(app).get('/api/bins').set('Cookie', residentACookie)
    const codes = allBinsAsResidentA.body.data.bins.map((b: { code: string }) => b.code)
    expect(codes).toEqual(expect.arrayContaining(['ROADSIDE-4', 'HOUSE-4A', 'HOUSE-4B']))

    const allBinsAnonymous = await request(app).get('/api/bins')
    const anonCodes = allBinsAnonymous.body.data.bins.map((b: { code: string }) => b.code)
    expect(anonCodes).toEqual(expect.arrayContaining(['ROADSIDE-4', 'HOUSE-4A', 'HOUSE-4B']))
  })

  it('switching a house bin back to roadside clears its assignment', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'owner-admin-5')
    const adminCookie = await login(app, request, admin.email)
    const resident = await createUser('public', 'owner-resident-5')

    const createRes = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'HOUSE-5',
        name: 'Switchable House Bin',
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: resident.id,
      })
    const binId = createRes.body.data.bin.id

    const switchRes = await request(app)
      .patch(`/api/bins/${binId}`)
      .set('Cookie', adminCookie)
      .send({ locationType: 'roadside' })
    expect(switchRes.status).toBe(200)
    expect(switchRes.body.data.bin.locationType).toBe('roadside')
    expect(switchRes.body.data.bin.assignedUserId).toBeNull()

    const residentCookie = await login(app, request, resident.email)
    const mineRes = await request(app).get('/api/bins/mine').set('Cookie', residentCookie)
    expect(mineRes.body.data.bins).toHaveLength(0)
  })

  it('rejects assigning a second house bin to a resident who already has one', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'owner-admin-6')
    const adminCookie = await login(app, request, admin.email)
    const resident = await createUser('public', 'owner-resident-6')

    const firstRes = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'HOUSE-6A',
        name: 'First House Bin',
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: resident.id,
      })
    expect(firstRes.status).toBe(201)

    const secondRes = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'HOUSE-6B',
        name: 'Second House Bin',
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: resident.id,
      })
    expect(secondRes.status).toBe(409)
    expect(secondRes.body.error.code).toBe('RESIDENT_ALREADY_ASSIGNED')

    // One resident, one house bin — the first assignment is untouched.
    const residentCookie = await login(app, request, resident.email)
    const mineRes = await request(app).get('/api/bins/mine').set('Cookie', residentCookie)
    expect(mineRes.body.data.bins).toHaveLength(1)
    expect(mineRes.body.data.bins[0].code).toBe('HOUSE-6A')
  })

  it('re-saving a house bin with its own existing assignment is not a false conflict', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const admin = await createUser('admin', 'owner-admin-7')
    const adminCookie = await login(app, request, admin.email)
    const resident = await createUser('public', 'owner-resident-7')

    const createRes = await request(app)
      .post('/api/bins')
      .set('Cookie', adminCookie)
      .send({
        code: 'HOUSE-7',
        name: 'Stable House Bin',
        address: 'Minna',
        capacityLiters: 100,
        locationType: 'house',
        assignedUserId: resident.id,
      })
    const binId = createRes.body.data.bin.id

    // Re-affirming locationType: 'house' without re-sending assignedUserId
    // should keep the existing assignment, not reject it as a conflict with
    // itself.
    const updateRes = await request(app)
      .patch(`/api/bins/${binId}`)
      .set('Cookie', adminCookie)
      .send({ locationType: 'house', capacityLiters: 150 })
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.data.bin.assignedUserId).toBe(resident.id)
    expect(updateRes.body.data.bin.capacityLiters).toBe(150)
  })
})
