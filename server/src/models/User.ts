import { Schema, model, type InferSchemaType } from 'mongoose'
import { UserRole } from '../types/enums.js'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.PUBLIC, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export type UserDoc = InferSchemaType<typeof userSchema>
export const User = model('User', userSchema)
