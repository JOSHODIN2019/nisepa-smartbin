export interface SystemSettings {
  simulatedWasteMinPercent: number
  simulatedWasteMaxPercent: number
  updatedBy?: { _id: string; name: string } | string
  updatedAt: string
}
