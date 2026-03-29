import type { CourtSide, CourtTeams } from '../types/liveSession'

const COURT_COUNT = 9

function findTeam(
  courts: CourtTeams[],
  name: string,
): { court: number; side: CourtSide } | null {
  for (let i = 0; i < courts.length; i++) {
    if (courts[i].home === name) return { court: i, side: 'home' }
    if (courts[i].away === name) return { court: i, side: 'away' }
  }
  return null
}

function swapSlots(
  courts: CourtTeams[],
  a: { court: number; side: CourtSide },
  b: { court: number; side: CourtSide },
) {
  const ta = courts[a.court][a.side]
  const tb = courts[b.court][b.side]
  courts[a.court][a.side] = tb
  courts[b.court][b.side] = ta
}

/**
 * After a full round, for each boundary k = 2..9: swap loser from court k-1
 * with winner from court k (1-based court numbers). Uses initial names from
 * `pendingWinners` against `courts` snapshot, locates teams in current state.
 */
export function applyRound(
  courts: CourtTeams[],
  pendingWinners: CourtSide[],
): CourtTeams[] {
  if (courts.length !== COURT_COUNT || pendingWinners.length !== COURT_COUNT) {
    throw new Error('Expected 9 courts and 9 pending winners')
  }

  const initial = courts.map((c) => ({ ...c }))

  const loserName = (i: number) =>
    initial[i][pendingWinners[i] === 'home' ? 'away' : 'home']
  const winnerName = (i: number) => initial[i][pendingWinners[i]]

  const next = initial.map((c) => ({ ...c }))

  for (let k = 2; k <= COURT_COUNT; k++) {
    const nameL = loserName(k - 2)
    const nameW = winnerName(k - 1)
    const posL = findTeam(next, nameL)
    const posW = findTeam(next, nameW)
    if (!posL || !posW) {
      throw new Error(
        `Could not locate teams for boundary ${k}: "${nameL}", "${nameW}"`,
      )
    }
    swapSlots(next, posL, posW)
  }

  return next
}
