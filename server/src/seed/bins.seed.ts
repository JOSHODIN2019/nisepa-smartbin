import { WasteBin } from '../models/WasteBin.js'
import { User } from '../models/User.js'
import { getBinStatus, BinLocationType } from '../types/enums.js'

// Demo bin fixtures for the academic prototype (PROJECT_MEMORY.md Section 32 —
// "the demonstration should allow the researcher to show ... waste being
// added"). Locations are real Minna, Niger State neighborhoods; the bins
// themselves and their starting levels are illustrative seed data, not real
// sensor readings.
const DEMO_ROADSIDE_BINS = [
  { code: 'NISEPA-BIN-001', name: 'Minna Central Market', address: 'Central Market, Minna, Niger State', startLevel: 62 },
  { code: 'NISEPA-BIN-002', name: 'Bosso Estate', address: 'Bosso Estate, Minna, Niger State', startLevel: 35 },
  { code: 'NISEPA-BIN-003', name: 'Tunga Low Cost', address: 'Tunga Low Cost, Minna, Niger State', startLevel: 88 },
  { code: 'NISEPA-BIN-004', name: 'Chanchaga Roundabout', address: 'Chanchaga, Minna, Niger State', startLevel: 12 },
  { code: 'NISEPA-BIN-005', name: 'Paiko Road', address: 'Paiko Road, Minna, Niger State', startLevel: 95 },
]

// Household bins — one per resident (Section 36.5: one resident, one house
// bin). Only the first is assigned, to the public demo account, so its
// dashboard has something to show out of the box; the rest are seeded
// unassigned, standing in for households NISEPA has registered a bin for
// but not yet linked to a login — exactly the "Unassigned for now" case
// Admin > Bin Management already supports, and a realistic partial rollout
// rather than every household magically having an account on day one.
const DEMO_HOUSE_BINS = [
  { code: 'NISEPA-BIN-006', name: 'No. 12 Bosso Close (Residence)', address: 'No. 12 Bosso Close, Minna, Niger State', startLevel: 40, assignToPublicDemo: true },
  { code: 'NISEPA-BIN-007', name: 'No. 7 Tunga Low Cost (Residence)', address: 'No. 7 Tunga Low Cost, Minna, Niger State', startLevel: 55 },
  { code: 'NISEPA-BIN-008', name: 'No. 3 Chanchaga Estate (Residence)', address: 'No. 3 Chanchaga Estate, Minna, Niger State', startLevel: 78 },
  { code: 'NISEPA-BIN-009', name: 'No. 21 GRA Housing Estate (Residence)', address: 'No. 21 GRA Housing Estate, Minna, Niger State', startLevel: 15 },
  { code: 'NISEPA-BIN-010', name: 'No. 5 Maitumbi Close (Residence)', address: 'No. 5 Maitumbi Close, Minna, Niger State', startLevel: 91 },
]

export async function seedDemoBinsIfEmpty(): Promise<void> {
  const existing = await WasteBin.countDocuments()
  if (existing > 0) return

  await WasteBin.insertMany(
    DEMO_ROADSIDE_BINS.map((b) => ({
      code: b.code,
      name: b.name,
      location: { address: b.address },
      capacityLiters: 240,
      currentLevelPercent: b.startLevel,
      status: getBinStatus(b.startLevel),
      locationType: BinLocationType.ROADSIDE,
    })),
  )

  const publicDemoUser = await User.findOne({ email: 'public@nisepa.demo' })
  await WasteBin.insertMany(
    DEMO_HOUSE_BINS.map((b) => ({
      code: b.code,
      name: b.name,
      location: { address: b.address },
      capacityLiters: 120,
      currentLevelPercent: b.startLevel,
      status: getBinStatus(b.startLevel),
      locationType: BinLocationType.HOUSE,
      assignedUserId: b.assignToPublicDemo ? (publicDemoUser?.id ?? null) : null,
    })),
  )

  console.log(
    `[seed] created ${DEMO_ROADSIDE_BINS.length} roadside bins + ${DEMO_HOUSE_BINS.length} house bins${publicDemoUser ? ' (1 assigned to public demo account, rest unassigned)' : ''}`,
  )
}
