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
  const email = `rootadmin-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`
  const admin = await User.create({
    name: 'Root Admin',
    email,
    passwordHash: await bcrypt.hash('password123', 4),
    role: 'admin',
  })
  const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
  return { cookie: res.headers['set-cookie'], adminId: admin.id }
}

describe('user management (Stage 38, admin-only)', () => {
  it('is blocked for public and staff roles', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Rando', email: 'rando@example.com', password: 'password123', address: '4 Rando Close, Minna' })
    const publicCookie = registerRes.headers['set-cookie']

    const res = await request(app).get('/api/users').set('Cookie', publicCookie)
    expect(res.status).toBe(403)

    const noAuthRes = await request(app).get('/api/users')
    expect(noAuthRes.status).toBe(401)
  })

  it('lets an admin create a staff account, list users, and update role/status', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()
    const { cookie } = await loginAsAdmin(app, request)

    const createRes = await request(app)
      .post('/api/users')
      .set('Cookie', cookie)
      .send({ name: 'New Staff', email: 'newstaff@example.com', password: 'password123', role: 'staff' })
    expect(createRes.status).toBe(201)
    expect(createRes.body.data.user.role).toBe('staff')
    const newUserId = createRes.body.data.user.id

    // The new staff account can actually log in with the password the admin set.
    const staffLoginRes = await request(app).post('/api/auth/login').send({ email: 'newstaff@example.com', password: 'password123' })
    expect(staffLoginRes.status).toBe(200)

    const listRes = await request(app).get('/api/users').set('Cookie', cookie)
    expect(listRes.status).toBe(200)
    expect(listRes.body.data.users.length).toBeGreaterThanOrEqual(2)
    // passwordHash must never leak in the API response.
    expect(listRes.body.data.users[0]).not.toHaveProperty('passwordHash')

    const deactivateRes = await request(app).patch(`/api/users/${newUserId}`).set('Cookie', cookie).send({ isActive: false })
    expect(deactivateRes.status).toBe(200)
    expect(deactivateRes.body.data.user.isActive).toBe(false)

    // A deactivated account can no longer log in.
    const blockedLoginRes = await request(app).post('/api/auth/login').send({ email: 'newstaff@example.com', password: 'password123' })
    expect(blockedLoginRes.status).toBe(401)
  })

  it('prevents an admin from demoting or deactivating their own account', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()
    const { cookie, adminId } = await loginAsAdmin(app, request)

    const demoteRes = await request(app).patch(`/api/users/${adminId}`).set('Cookie', cookie).send({ role: 'staff' })
    expect(demoteRes.status).toBe(400)
    expect(demoteRes.body.error.code).toBe('CANNOT_DEMOTE_SELF')

    const deactivateRes = await request(app).patch(`/api/users/${adminId}`).set('Cookie', cookie).send({ isActive: false })
    expect(deactivateRes.status).toBe(400)
    expect(deactivateRes.body.error.code).toBe('CANNOT_DEACTIVATE_SELF')
  })

  it("exposes a public resident's registered address to admin, so a bin can be installed at the right place", async () => {
    const { createApp } = await import('../../server/src/app.js')
    const request = (await import('supertest')).default
    const app = createApp()
    const { cookie } = await loginAsAdmin(app, request)

    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Address Resident', email: 'address-resident@example.com', password: 'password123', address: '9 Address Way, Minna' })

    const listRes = await request(app).get('/api/users').set('Cookie', cookie)
    const resident = listRes.body.data.users.find((u: { email: string }) => u.email === 'address-resident@example.com')
    expect(resident.address).toBe('9 Address Way, Minna')
  })
})
