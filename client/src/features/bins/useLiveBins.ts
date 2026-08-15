import { useEffect, useState } from 'react'
import { binsApi } from './api'
import type { WasteBin } from './types'
import { useEventStream } from '@/lib/useEventStream'

// Stage 33 — refetches whenever any bin changes anywhere in the system
// (another visitor's "add waste", staff recording a collection, an admin
// editing/deactivating a bin), not just this tab's own actions.
export function useLiveBins() {
  const [bins, setBins] = useState<WasteBin[] | null>(null)

  function refetch() {
    binsApi.list().then(({ bins }) => setBins(bins))
  }

  useEffect(refetch, [])
  useEventStream({ 'bin.updated': refetch })

  return { bins, setBins, refetch }
}
