import { settingsRepository } from '../repositories/settings.repository.js'
import { ApiError } from '../utils/ApiError.js'
import type { UpdateSettingsInput } from '../validators/settings.validator.js'

export async function getSettings() {
  return settingsRepository.getOrCreateForDisplay()
}

export async function updateSettings(input: UpdateSettingsInput, updatedBy: string) {
  const current = await settingsRepository.getOrCreate()
  const nextMin = input.simulatedWasteMinPercent ?? current.simulatedWasteMinPercent
  const nextMax = input.simulatedWasteMaxPercent ?? current.simulatedWasteMaxPercent

  if (nextMin > nextMax) {
    throw ApiError.badRequest('simulatedWasteMinPercent must be <= simulatedWasteMaxPercent', 'INVALID_RANGE')
  }

  return settingsRepository.update(input, updatedBy)
}
