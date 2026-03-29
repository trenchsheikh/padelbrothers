import { useCallback, useState } from 'react'
import {
  defaultLiveBundle,
  emptyPendingWinners,
  initialLiveBundle,
  MAX_ROUNDS,
  saveLiveBundle,
} from '../lib/liveStorage'
import { applyRound } from '../lib/liveLadder'
import { formatTeamLabel, parseTeamsPaste } from '../lib/parseTeamsPaste'
import {
  applyTeamMove,
  type DragSource,
  type DropTarget,
} from '../lib/liveTeamMove'
import type { CourtSide, CourtTeams, LiveSessionBundle } from '../types/liveSession'

export function useLiveSession() {
  const [bundle, setBundle] = useState<LiveSessionBundle>(initialLiveBundle)

  const updateCourt = useCallback((index: number, patch: Partial<CourtTeams>) => {
    setBundle((b) => {
      const courts = b.courts.map((c, i) =>
        i === index ? { ...c, ...patch } : c,
      )
      const next: LiveSessionBundle = {
        ...b,
        courts,
        updatedAt: new Date().toISOString(),
      }
      saveLiveBundle(next)
      return next
    })
  }, [])

  const setPendingWinner = useCallback((courtIndex: number, side: CourtSide) => {
    setBundle((b) => {
      const pendingWinners = [...b.pendingWinners]
      pendingWinners[courtIndex] = side
      const next: LiveSessionBundle = {
        ...b,
        pendingWinners,
        updatedAt: new Date().toISOString(),
      }
      saveLiveBundle(next)
      return next
    })
  }, [])

  const clearPending = useCallback(() => {
    setBundle((b) => {
      const next: LiveSessionBundle = {
        ...b,
        pendingWinners: emptyPendingWinners(),
        updatedAt: new Date().toISOString(),
      }
      saveLiveBundle(next)
      return next
    })
  }, [])

  const setLineupLocked = useCallback((locked: boolean) => {
    setBundle((b) => {
      const next: LiveSessionBundle = {
        ...b,
        lineupLocked: locked,
        updatedAt: new Date().toISOString(),
      }
      saveLiveBundle(next)
      return next
    })
  }, [])

  const applyRoundAndAdvance = useCallback(() => {
    setBundle((b) => {
      const filled = b.pendingWinners.every((w) => w !== null)
      if (!filled) return b
      const sides = b.pendingWinners as CourtSide[]
      const nextCourts = applyRound(b.courts, sides)
      const next: LiveSessionBundle = {
        ...b,
        courts: nextCourts,
        round: b.round + 1,
        pendingWinners: emptyPendingWinners(),
        updatedAt: new Date().toISOString(),
      }
      saveLiveBundle(next)
      return next
    })
  }, [])

  const resetSession = useCallback(() => {
    const next = defaultLiveBundle()
    saveLiveBundle(next)
    setBundle(next)
  }, [])

  const addTeamsFromPaste = useCallback((text: string) => {
    const pairs = parseTeamsPaste(text)
    if (pairs.length === 0) return
    setBundle((b) => {
      const pool = [...b.teamPool]
      const onCourt = new Set<string>()
      for (const c of b.courts) {
        if (c.home.trim()) onCourt.add(c.home.trim())
        if (c.away.trim()) onCourt.add(c.away.trim())
      }
      for (const p of pairs) {
        const label = formatTeamLabel(p)
        if (pool.includes(label) || onCourt.has(label)) continue
        pool.push(label)
      }
      const next: LiveSessionBundle = {
        ...b,
        teamPool: pool,
        updatedAt: new Date().toISOString(),
      }
      saveLiveBundle(next)
      return next
    })
  }, [])

  const moveTeam = useCallback((from: DragSource, to: DropTarget) => {
    setBundle((b) => {
      const next = applyTeamMove(b, from, to)
      if (next !== b) saveLiveBundle(next)
      return next
    })
  }, [])

  const canApplyRound =
    bundle.pendingWinners.every((w) => w !== null) &&
    bundle.round < MAX_ROUNDS &&
    bundle.courts.every(
      (c) => c.home.trim() !== '' && c.away.trim() !== '',
    )

  return {
    bundle,
    updateCourt,
    setPendingWinner,
    clearPending,
    setLineupLocked,
    applyRoundAndAdvance,
    resetSession,
    addTeamsFromPaste,
    moveTeam,
    canApplyRound,
    maxRoundsReached: bundle.round >= MAX_ROUNDS,
  }
}
