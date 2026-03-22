import { useCallback, useState } from 'react'
import type { PersistedBundle, Season } from '../types'
import {
  cloneSeed,
  initialBundle,
  savePersisted,
} from '../lib/storage'

export function useSeasonState() {
  const [bundle, setBundle] = useState<PersistedBundle>(initialBundle)

  const saveSeason = useCallback((season: Season) => {
    const next: PersistedBundle = {
      season,
      updatedAt: new Date().toISOString(),
    }
    savePersisted(next)
    setBundle(next)
  }, [])

  const resetToSeed = useCallback(() => {
    const next: PersistedBundle = {
      season: cloneSeed(),
      updatedAt: new Date().toISOString(),
    }
    savePersisted(next)
    setBundle(next)
  }, [])

  return {
    season: bundle.season,
    updatedAt: bundle.updatedAt,
    saveSeason,
    resetToSeed,
  }
}
