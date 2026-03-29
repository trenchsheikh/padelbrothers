import type { CourtSide, CourtTeams, LiveSessionBundle } from '../types/liveSession'

export const LIVE_STORAGE_KEY = 'padelbros.liveSession.v1'

export const MAX_ROUNDS = 2

const EMPTY_COURT = (): CourtTeams => ({ home: '', away: '' })

export function emptyCourts(): CourtTeams[] {
  return Array.from({ length: 9 }, () => EMPTY_COURT())
}

export function emptyPendingWinners(): (CourtSide | null)[] {
  return Array.from({ length: 9 }, (): CourtSide | null => null)
}

export function defaultLiveBundle(): LiveSessionBundle {
  return {
    courts: emptyCourts(),
    teamPool: [],
    round: 0,
    pendingWinners: emptyPendingWinners(),
    lineupLocked: false,
    updatedAt: new Date().toISOString(),
  }
}

function isCourtTeams(x: unknown): x is CourtTeams {
  return (
    typeof x === 'object' &&
    x !== null &&
    typeof (x as CourtTeams).home === 'string' &&
    typeof (x as CourtTeams).away === 'string'
  )
}

export function loadLiveBundle(): LiveSessionBundle | null {
  try {
    const raw = localStorage.getItem(LIVE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== 'object' || parsed === null) return null
    const p = parsed as Record<string, unknown>
    if (!Array.isArray(p.courts) || p.courts.length !== 9) return null
    if (!p.courts.every(isCourtTeams)) return null
    if (typeof p.round !== 'number' || p.round < 0) return null
    if (!Array.isArray(p.pendingWinners) || p.pendingWinners.length !== 9)
      return null
    const okPending = p.pendingWinners.every(
      (w) => w === null || w === 'home' || w === 'away',
    )
    if (!okPending) return null
    if (typeof p.lineupLocked !== 'boolean') return null
    if (typeof p.updatedAt !== 'string') return null
    const teamPool =
      Array.isArray(p.teamPool) && p.teamPool.every((x) => typeof x === 'string')
        ? (p.teamPool as string[])
        : []
    return {
      courts: p.courts as CourtTeams[],
      teamPool,
      round: p.round,
      pendingWinners: p.pendingWinners as LiveSessionBundle['pendingWinners'],
      lineupLocked: p.lineupLocked,
      updatedAt: p.updatedAt,
    }
  } catch {
    return null
  }
}

export function saveLiveBundle(bundle: LiveSessionBundle): void {
  localStorage.setItem(LIVE_STORAGE_KEY, JSON.stringify(bundle))
}

export function initialLiveBundle(): LiveSessionBundle {
  if (typeof localStorage === 'undefined') {
    return defaultLiveBundle()
  }
  const loaded = loadLiveBundle()
  if (loaded) return loaded
  return defaultLiveBundle()
}
