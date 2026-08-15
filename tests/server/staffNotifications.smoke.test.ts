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

describe('staff/admin notification inbox (Stage 28)', () => {
  it('every active staff/admin gets a personal notification when a threshold is crossed, inactive accounts do not', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { User } = await import('../../server/src/models/User.js')
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const bcrypt = (await import('bcryptjs')).default
    const request = (await import('supertest')).default
    const app = createApp()

    const passwordHash = await bcrypt.hash('password123', 4)
    const staff1 = await User.create({ name: 'Staff One', email: 'staff1@example.com', passwordHash, role: 'staff' })
    const staff2 = await User.create({ name: 'Staff Two', email: 'staff2@example.com', passwordHash, role: 'admin' })
    const inactiveStaff = await User.create({
      name: 'Inactive Staff',
      email: 'inactive-staff@example.com',
      passwordHash,
      role: 'staff',
      isActive: false,
    })

    const bin = await WasteBin.create({
      code: 'STAFFNOTIF-BIN-01',
      name: 'Staff Notif Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 200,
      currentLevelPercent: 75,
    })

    // Public, unauthenticated push — crosses into Warning (80%).
    await request(app).post(`/api/bins/${bin.id}/waste`).send({ amountPercent: 10 })

    async function loginAs(email: string) {
      const res = await request(app).post('/api/auth/login').send({ email, password: 'password123' })
      return res.headers['set-cookie']
    }

    const staff1Res = await request(app).get('/api/notifications').set('Cookie', await loginAs(staff1.email))
    expect(staff1Res.body.data.notifications).toHaveLength(1)
    expect(staff1Res.body.data.notifications[0].message).toContain('Warning')

    const staff2Res = await request(app).get('/api/notifications').set('Cookie', await loginAs(staff2.email))
    expect(staff2Res.body.data.notifications).toHaveLength(1)

    // Deactivated accounts can't log in at all (Stage 38 guarantee), so
    // querying their notifications directly confirms none were created —
    // rather than trying to prove a negative through a login that would fail.
    const { Notification } = await import('../../server/src/models/Notification.js')
    const inactiveNotifs = await Notification.find({ userId: inactiveStaff.id })
    expect(inactiveNotifs).toHaveLength(0)
  })
})
