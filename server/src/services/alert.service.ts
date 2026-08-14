import mongoose from 'mongoose'
import { alertRepository } from '../repositories/alert.repository.js'
import { ApiError } from '../utils/ApiError.js'
import { AlertStatus, type AlertThreshold, type BinStatus } from '../types/enums.js'

const THRESHOLD_LABEL: Record<AlertThreshold, string> = {
  80: 'Warning (80%)',
  90: 'High Priority (90%)',
  100: 'Full (100%)',
}

export async function raiseThresholdAlert(binId: string, binName: string, threshold: AlertThreshold, _status: BinStatus) {
  return alertRepository.create({
    binId,
    threshold,
    message: `${binName} has crossed the ${THRESHOLD_LABEL[threshold]} threshold.`,
  })
}

export async function listAlerts() {
  return alertRepository.findAll()
}

export async function acknowledgeAlert(id: string, userId: string) {
  const alert = await alertRepository.findById(id)
  if (!alert) throw ApiError.notFound('Alert not found')
  if (alert.status === AlertStatus.NEW) {
    alert.status = AlertStatus.ACKNOWLEDGED
    alert.acknowledgedBy = new mongoose.Types.ObjectId(userId)
    alert.acknowledgedAt = new Date()
    await alert.save()
  }
  return alert
}

export async function resolveAlert(id: string) {
  const alert = await alertRepository.findById(id)
  if (!alert) throw ApiError.notFound('Alert not found')
  alert.status = AlertStatus.RESOLVED
  alert.resolvedAt = new Date()
  await alert.save()
  return alert
}
