// Stage 23 — Simulated ESP32 Layer. Stands in for the microcontroller that
// reads the sensor and transmits a level-change payload to the server over
// the network. A real ESP32 would poll the sensor on an interval and POST to
// the IoT Data API (Stage 24 — addSimulatedWaste); here, "polling" happens on
// demand when a public visitor triggers an interaction, but the boundary is
// the same: this module owns "how do we get a reading", the API layer owns
// "what do we do with it".
import { settingsRepository } from '../repositories/settings.repository.js'
import { readLevelChangePercent } from './sensor.simulation.js'

export async function captureSensorReading(): Promise<number> {
  const settings = await settingsRepository.getOrCreate()
  return readLevelChangePercent(settings.simulatedWasteMinPercent, settings.simulatedWasteMaxPercent)
}
