import type { DragEvent } from 'react'
import type { CourtSide, CourtTeams, LiveSessionBundle } from '../types/liveSession'

export type DragSource =
  | { type: 'pool'; index: number }
  | { type: 'court'; courtIndex: number; side: CourtSide }

export type DropTarget =
  | { type: 'pool' }
  | { type: 'court'; courtIndex: number; side: CourtSide }

const MIME = 'application/x-padelbros-live-team'

export function setDragPayload(e: DragEvent<HTMLElement>, source: DragSource) {
  const encoded = JSON.stringify(source)
  try {
    e.dataTransfer.setData(MIME, encoded)
  } catch {
    /* ignore */
  }
  e.dataTransfer.setData('text/plain', encoded)
  e.dataTransfer.effectAllowed = 'move'
}

/**
 * Prefer reading custom MIME; fall back to text/plain (Safari / stricter browsers).
 */
export function getDragPayload(e: DragEvent<HTMLElement>): DragSource | null {
  let raw = ''
  try {
    raw = e.dataTransfer.getData(MIME)
  } catch {
    raw = ''
  }
  if (!raw) {
    try {
      raw = e.dataTransfer.getData('text/plain')
    } catch {
      raw = ''
    }
  }
  if (!raw) return null
  try {
    const v = JSON.parse(raw) as DragSource
    if (v.type === 'pool' && typeof v.index === 'number') return v
    if (
      v.type === 'court' &&
      typeof v.courtIndex === 'number' &&
      (v.side === 'home' || v.side === 'away')
    ) {
      return v
    }
    return null
  } catch {
    return null
  }
}

export function applyTeamMove(
  b: LiveSessionBundle,
  from: DragSource,
  to: DropTarget,
): LiveSessionBundle {
  let pool = [...b.teamPool]
  const courts: CourtTeams[] = b.courts.map((c) => ({ ...c }))

  const get = (ci: number, s: CourtSide) => courts[ci][s]
  const set = (ci: number, s: CourtSide, v: string) => {
    courts[ci][s] = v
  }

  let sourceTeam: string
  if (from.type === 'pool') {
    if (from.index < 0 || from.index >= pool.length) return b
    sourceTeam = pool[from.index]
  } else {
    sourceTeam = get(from.courtIndex, from.side)
    if (!sourceTeam.trim()) return b
  }

  if (to.type === 'pool' && from.type === 'pool') return b
  if (
    to.type === 'court' &&
    from.type === 'court' &&
    from.courtIndex === to.courtIndex &&
    from.side === to.side
  ) {
    return b
  }

  const updatedAt = new Date().toISOString()

  if (to.type === 'pool') {
    if (from.type !== 'court') return b
    set(from.courtIndex, from.side, '')
    pool.push(sourceTeam)
    return { ...b, teamPool: pool, courts, updatedAt }
  }

  const toCi = to.courtIndex
  const toSide = to.side
  const destTeam = get(toCi, toSide)

  if (from.type === 'pool') {
    if (from.index < 0 || from.index >= pool.length) return b
    pool = pool.filter((_, i) => i !== from.index)
    if (destTeam.trim()) pool.push(destTeam)
    set(toCi, toSide, sourceTeam)
    return { ...b, teamPool: pool, courts, updatedAt }
  }

  const fromCi = from.courtIndex
  const fromSide = from.side
  if (fromCi === toCi && fromSide === toSide) return b

  if (destTeam.trim()) {
    set(fromCi, fromSide, destTeam)
    set(toCi, toSide, sourceTeam)
  } else {
    set(fromCi, fromSide, '')
    set(toCi, toSide, sourceTeam)
  }
  return { ...b, teamPool: pool, courts, updatedAt }
}
