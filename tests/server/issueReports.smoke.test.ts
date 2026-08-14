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

describe('issue reports (Stage 21)', () => {
  it('accepts an anonymous report and rejects a too-short description', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { IssueReport } = await import('../../server/src/models/IssueReport.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const res = await request(app)
      .post('/api/issues')
      .send({ description: 'Overflowing bin near the market entrance for two days.', locationText: 'Minna Central Market' })
    expect(res.status).toBe(201)
    expect(res.body.data.report.status).toBe('new')

    const saved = await IssueReport.findById(res.body.data.report.id)
    expect(saved?.reporterId).toBeUndefined()
    expect(saved?.locationText).toBe('Minna Central Market')

    const badRes = await request(app).post('/api/issues').send({ description: 'too short' })
    expect(badRes.status).toBe(400)
    expect(badRes.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('links the report to the logged-in user when authenticated', async () => {
    const { createApp } = await import('../../server/src/app.js')
    const { IssueReport } = await import('../../server/src/models/IssueReport.js')
    const request = (await import('supertest')).default
    const app = createApp()

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Reporter', email: 'reporter@example.com', password: 'password123' })
    const cookie = registerRes.headers['set-cookie']
    const userId = registerRes.body.data.user.id

    const res = await request(app)
      .post('/api/issues')
      .set('Cookie', cookie)
      .send({ description: 'Illegal dumping spotted behind the estate fence.' })
    expect(res.status).toBe(201)

    const saved = await IssueReport.findById(res.body.data.report.id)
    expect(saved?.reporterId?.toString()).toBe(userId)
  })
})
