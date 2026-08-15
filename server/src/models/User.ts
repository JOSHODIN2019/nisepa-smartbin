import { Schema, model, type InferSchemaType } from 'mongoose'
import { UserRole } from '../types/enums.js'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(UserRole), required: true, default: UserRole.PUBLIC, index: true },
    isActive: { type: Boolean, default: true },
    // A public resident's home address — collected at self-registration so
    // NISEPA knows where to install a bin before one is ever assigned.
    // Optional at the schema level (staff/admin accounts never set it, and
    // it predates this field for any account created earlier).
    address: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
)

export type UserDoc = InferSchemaType<typeof userSchema>
export const User = model('User', userSchema)
