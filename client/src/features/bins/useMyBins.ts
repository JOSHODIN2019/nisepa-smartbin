import { useEffect, useState } from 'react'
import { binsApi } from './api'
import type { WasteBin } from './types'
import { useEventStream } from '@/lib/useEventStream'

// A logged-in public resident's own house bin(s) only — never the shared
// roadside network (see /smart-bin for that). Empty when no bin has been
// assigned to this account yet.
export function useMyBins() {
  const [bins, setBins] = useState<WasteBin[] | null>(null)

  function refetch() {
    binsApi.mine().then(({ bins }) => setBins(bins))
  }

  useEffect(refetch, [])
  useEventStream({ 'bin.updated': refetch })

  return { bins, refetch }
}
