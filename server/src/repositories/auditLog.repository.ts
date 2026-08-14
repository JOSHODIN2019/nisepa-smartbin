import { AuditLog } from '../models/AuditLog.js'

export const auditLogRepository = {
  create(input: { userId?: string; action: string; targetType: string; targetId?: string; metadata?: unknown }) {
    return AuditLog.create(input)
  },
  findAll(limit = 200) {
    return AuditLog.find().sort({ createdAt: -1 }).limit(limit).populate('userId', 'name email role')
  },
}
