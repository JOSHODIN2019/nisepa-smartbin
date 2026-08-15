// Stage 22 — Simulated Sensor Service. Stands in for a real ultrasonic
// distance sensor mounted at the top of a physical bin: as waste fills the
// bin, the measured distance to the waste surface shrinks, which a real
// device would convert to a fill percentage. Here we skip straight to the
// percentage-change output, since there is no physical distance to measure —
// but this is the module a real sensor driver would replace (Section 5.1).
export function readLevelChangePercent(minPercent: number, maxPercent: number): number {
  return Math.round(minPercent + Math.random() * (maxPercent - minPercent))
}
