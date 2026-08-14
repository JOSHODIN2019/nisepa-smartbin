import mongoose from 'mongoose'
import { env } from './env.js'

mongoose.set('strictQuery', true)

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('connected', () => {
    console.log('[db] MongoDB Atlas connected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('[db] MongoDB connection error:', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected')
  })

  await mongoose.connect(env.MONGODB_URI)
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect()
}
