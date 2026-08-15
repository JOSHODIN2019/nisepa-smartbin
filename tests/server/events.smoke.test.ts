import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import http from 'node:http'

let mongod: MongoMemoryServer
let server: http.Server
let baseUrl: string

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongod.getUri()
  process.env.JWT_SECRET = 'test-secret-at-least-32-characters-long'
  await mongoose.connect(mongod.getUri())

  const { createApp } = await import('../../server/src/app.js')
  const app = createApp()
  server = app.listen(0)
  await new Promise<void>((resolve) => server.once('listening', resolve))
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  baseUrl = `http://127.0.0.1:${port}`
})

afterAll(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()))
  await mongoose.disconnect()
  await mongod.stop()
})

function waitForSseEvent(path: string, eventType: string, timeoutMs = 4000): Promise<{ raw: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get(`${baseUrl}${path}`, (res) => {
      let buffer = ''
      const timer = setTimeout(() => {
        req.destroy()
        reject(new Error(`Timed out waiting for SSE event "${eventType}". Received so far:\n${buffer}`))
      }, timeoutMs)

      res.on('data', (chunk: Buffer) => {
        buffer += chunk.toString()
        if (buffer.includes(`event: ${eventType}`)) {
          clearTimeout(timer)
          req.destroy()
          resolve({ raw: buffer })
        }
      })
      res.on('error', reject)
    })
    req.on('error', reject)
  })
}

describe('real-time events (Stage 25) — actual SSE delivery, not just a 200', () => {
  it('broadcasts bin.updated to an unauthenticated (public) listener when a bin is updated', async () => {
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const bin = await WasteBin.create({
      code: 'SSE-BIN-01',
      name: 'SSE Test Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 200,
      currentLevelPercent: 10,
    })

    const listenPromise = waitForSseEvent('/api/events', 'bin.updated')
    // Give the listener a moment to actually attach before triggering the change.
    await new Promise((r) => setTimeout(r, 200))

    // supertest isn't used here since we need the request to fire concurrently
    // with an open SSE connection; a plain POST via http.request is simplest.
    await new Promise<void>((resolve, reject) => {
      const req = http.request(
        `${baseUrl}/api/bins/${bin.id}/waste`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        (res) => {
          res.on('data', () => {})
          res.on('end', resolve)
        },
      )
      req.on('error', reject)
      req.end(JSON.stringify({ amountPercent: 15 }))
    })

    const { raw } = await listenPromise
    expect(raw).toContain('event: bin.updated')
    expect(raw).toContain('SSE-BIN-01')
  })

  it('does NOT forward staff-scoped events to an unauthenticated listener', async () => {
    const { WasteBin } = await import('../../server/src/models/WasteBin.js')
    const bin = await WasteBin.create({
      code: 'SSE-BIN-02',
      name: 'SSE Alert Bin',
      location: { address: 'Minna, Niger State' },
      capacityLiters: 200,
      currentLevelPercent: 78,
    })

    let sawAlertEvent = false
    let sawBinEvent = false
    const req = http.get(`${baseUrl}/api/events`, (res) => {
      res.on('data', (chunk: Buffer) => {
        const text = chunk.toString()
        if (text.includes('event: alert.created')) sawAlertEvent = true
        if (text.includes('event: bin.updated')) sawBinEvent = true
      })
    })

    await new Promise((r) => setTimeout(r, 200))
    // Crosses 80% -> triggers both a public bin.updated AND a staff-only alert.created.
    await new Promise<void>((resolve, reject) => {
      const postReq = http.request(
        `${baseUrl}/api/bins/${bin.id}/waste`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } },
        (res) => {
          res.on('data', () => {})
          res.on('end', resolve)
        },
      )
      postReq.on('error', reject)
      postReq.end(JSON.stringify({ amountPercent: 5 }))
    })
    await new Promise((r) => setTimeout(r, 500))
    req.destroy()

    expect(sawBinEvent).toBe(true)
    expect(sawAlertEvent).toBe(false)
  })
})
