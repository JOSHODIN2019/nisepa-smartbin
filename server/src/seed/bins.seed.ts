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

// Household bins — assigned to the public demo account so its dashboard has
// something to show. A real deployment would assign these one at a time as
// NISEPA registers each household, via Admin > Bin Management.
const DEMO_HOUSE_BINS = [
  { code: 'NISEPA-BIN-006', name: 'No. 12 Bosso Close (Residence)', address: 'No. 12 Bosso Close, Minna, Niger State', startLevel: 40 },
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
      assignedUserId: publicDemoUser?.id ?? null,
    })),
  )

  console.log(
    `[seed] created ${DEMO_ROADSIDE_BINS.length} roadside bins + ${DEMO_HOUSE_BINS.length} house bin(s)${publicDemoUser ? ' (assigned to public demo account)' : ''}`,
  )
}
