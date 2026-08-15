import { describe, expect, it } from 'vitest'
import { readLevelChangePercent } from '../../server/src/simulations/sensor.simulation.js'

// Stage 22 (Simulated Sensor) unit coverage. Stage 23 (ESP32 layer) is
// exercised indirectly by every bins.smoke.test.ts / settings.smoke.test.ts
// call to POST /api/bins/:id/waste without an explicit amountPercent, since
// that's exactly the path that goes through captureSensorReading().
describe('sensor simulation (Stage 22)', () => {
  it('stays within the given range across many samples', () => {
    for (let i = 0; i < 200; i++) {
      const reading = readLevelChangePercent(5, 15)
      expect(reading).toBeGreaterThanOrEqual(5)
      expect(reading).toBeLessThanOrEqual(15)
    }
  })

  it('returns the fixed value when min equals max', () => {
    expect(readLevelChangePercent(20, 20)).toBe(20)
  })
})
