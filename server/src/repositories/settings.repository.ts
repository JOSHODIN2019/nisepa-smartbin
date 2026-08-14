import { Settings } from '../models/Settings.js'

const SETTINGS_ID = 'system'

export const settingsRepository = {
  // Raw (unpopulated) — used internally on the addSimulatedWaste hot path,
  // where updatedBy is irrelevant and populating it on every call would be
  // wasted work.
  async getOrCreate() {
    const existing = await Settings.findById(SETTINGS_ID)
    if (existing) return existing
    return Settings.create({ _id: SETTINGS_ID })
  },
  // Populated — for admin-facing display (GET /api/settings).
  async getOrCreateForDisplay() {
    const existing = await Settings.findById(SETTINGS_ID).populate('updatedBy', 'name')
    if (existing) return existing
    return Settings.create({ _id: SETTINGS_ID })
  },
  async update(input: { simulatedWasteMinPercent?: number; simulatedWasteMaxPercent?: number }, updatedBy: string) {
    const settings = await Settings.findByIdAndUpdate(
      SETTINGS_ID,
      { ...input, updatedBy },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
    )
    return settings?.populate('updatedBy', 'name')
  },
}
