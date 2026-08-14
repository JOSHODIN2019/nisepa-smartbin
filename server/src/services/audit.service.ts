import { auditLogRepository } from '../repositories/auditLog.repository.js'

// Fire-and-forget style helper: audit logging must never break the primary
// action it's recording. Callers await it (so ordering in tests is
// deterministic) but a failure here should not surface as a 500 to the user —
// hence the try/catch instead of letting it propagate.
export async function logActivity(
  userId: string | undefined,
  action: string,
  targetType: string,
  targetId?: string,
  metadata?: unknown,
) {
  try {
    await auditLogRepository.create({ userId, action, targetType, targetId, metadata })
  } catch (err) {
    console.error('[audit] failed to record activity log entry:', err)
  }
}

export async function listActivity() {
  return auditLogRepository.findAll()
}
