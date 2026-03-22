import seed from '../data/season4.json'
import type { PersistedBundle, Season } from '../types'

export const STORAGE_KEY = 'padelbros.season.v1'

export function cloneSeed(): Season {
  return JSON.parse(JSON.stringify(seed)) as Season
}

export function loadPersisted(): PersistedBundle | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedBundle
    if (
      !parsed?.season?.weeks ||
      !Array.isArray(parsed.season.weeks) ||
      typeof parsed.updatedAt !== 'string'
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function savePersisted(bundle: PersistedBundle): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle))
}

export function initialBundle(): PersistedBundle {
  if (typeof localStorage === 'undefined') {
    return { season: cloneSeed(), updatedAt: new Date().toISOString() }
  }
  const p = loadPersisted()
  if (p) return p
  return { season: cloneSeed(), updatedAt: new Date().toISOString() }
}
