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

describe('notifications (Stage 20)', () => {
  it('notifies the logged-in user when their action crosses a threshold, not on every add', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const bin = await WasteBin.create({
      code: 'NOTIF-BIN-01',
      name: 'Notification Test Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 240,
      currentLevelPercent: 40,
    })

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Notif User', email: 'notifuser@example.com', password: 'password123', address: '2 Notif Street, Minna' })
    const cookie = registerRes.headers['set-cookie']

    // 40 -> 50-ish: stays "normal", should NOT create a notification.
    await request(app).post(`/api/bins/${bin.id}/waste`).set('Cookie', cookie).send({ amountPercent: 10 })
    const afterFirst = await request(app).get('/api/notifications').set('Cookie', cookie)
    expect(afterFirst.body.data.notifications).toHaveLength(0)

    // 50 -> 85: crosses into "warning", should create exactly one notification.
    await request(app).post(`/api/bins/${bin.id}/waste`).set('Cookie', cookie).send({ amountPercent: 35 })
    const afterSecond = await request(app).get('/api/notifications').set('Cookie', cookie)
    expect(afterSecond.body.data.notifications).toHaveLength(1)
    expect(afterSecond.body.data.notifications[0].read).toBe(false)
    expect(afterSecond.body.data.notifications[0].message).toContain('warning')

    const notifId = afterSecond.body.data.notifications[0]._id
    const readRes = await request(app).patch(`/api/notifications/${notifId}/read`).set('Cookie', cookie)
    expect(readRes.status).toBe(200)
    expect(readRes.body.data.notification.read).toBe(true)

    // Unauthenticated add-waste must not throw even though there's no user to notify.
    const anonRes = await request(app).post(`/api/bins/${bin.id}/waste`).send({ amountPercent: 5 })
    expect(anonRes.status).toBe(200)

    const noAuthRes = await request(app).get('/api/notifications')
    expect(noAuthRes.status).toBe(401)
  })
})
