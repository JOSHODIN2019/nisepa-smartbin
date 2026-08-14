import { describe, expect, it } from 'vitest'
import { getBinStatus, statusToAlertThreshold, BinStatus } from '../../server/src/types/enums.js'

// Stage 55 (Threshold Testing) — exhaustive boundary coverage for the single
// source of truth every status computation in the app derives from.
describe('getBinStatus boundaries (Stage 55)', () => {
  it.each([
    [0, 'normal'],
    [1, 'normal'],
    [79, 'normal'],
    [80, 'warning'],
    [85, 'warning'],
    [89, 'warning'],
    [90, 'high_priority'],
    [95, 'high_priority'],
    [99, 'high_priority'],
    [100, 'full'],
  ])('%i%% -> %s', (level, expected) => {
    expect(getBinStatus(level)).toBe(expected)
  })
})

describe('statusToAlertThreshold', () => {
  it('maps warning/high_priority/full to 80/90/100, normal to null', () => {
    expect(statusToAlertThreshold(BinStatus.WARNING)).toBe(80)
    expect(statusToAlertThreshold(BinStatus.HIGH_PRIORITY)).toBe(90)
    expect(statusToAlertThreshold(BinStatus.FULL)).toBe(100)
    expect(statusToAlertThreshold(BinStatus.NORMAL)).toBeNull()
  })
})
