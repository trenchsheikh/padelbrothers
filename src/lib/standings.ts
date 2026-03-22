import type { Season, WeekEntry } from '../types'

export function normalizeName(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function canonicalTeamKey(playerA: string, playerB: string): string {
  const a = normalizeName(playerA)
  const b = normalizeName(playerB)
  return [a, b].sort().join('|')
}

function formatTeamLabel(a: string, b: string): string {
  return `${a.trim()} & ${b.trim()}`
}

export interface TeamStandingRow {
  key: string
  label: string
  totalChampsWins: number
}

export interface PlayerStandingRow {
  name: string
  totalChampsWins: number
}

/** Season team leaderboard: same pair across weeks aggregated by canonical key. */
export function getTeamStandings(season: Season): TeamStandingRow[] {
  const map = new Map<
    string,
    { total: number; label: string }
  >()

  for (const week of season.weeks) {
    for (const e of week.entries) {
      const key = canonicalTeamKey(e.playerA, e.playerB)
      const label = formatTeamLabel(e.playerA, e.playerB)
      const prev = map.get(key)
      if (prev) {
        map.set(key, {
          total: prev.total + e.champsWins,
          label,
        })
      } else {
        map.set(key, { total: e.champsWins, label })
      }
    }
  }

  return [...map.entries()]
    .map(([key, v]) => ({
      key,
      label: v.label,
      totalChampsWins: v.total,
    }))
    .sort((a, b) => {
      if (b.totalChampsWins !== a.totalChampsWins) {
        return b.totalChampsWins - a.totalChampsWins
      }
      return a.label.localeCompare(b.label)
    })
}

/** Each player receives their team's Champs wins for each week row they appear in. */
export function getPlayerStandings(season: Season): PlayerStandingRow[] {
  const map = new Map<string, { total: number; displayName: string }>()

  for (const week of season.weeks) {
    for (const e of week.entries) {
      for (const raw of [e.playerA, e.playerB]) {
        const k = normalizeName(raw)
        if (!k) continue
        const displayName = raw.trim()
        const prev = map.get(k)
        if (prev) {
          map.set(k, {
            total: prev.total + e.champsWins,
            displayName: prev.displayName,
          })
        } else {
          map.set(k, { total: e.champsWins, displayName })
        }
      }
    }
  }

  return [...map.values()]
    .map((v) => ({
      name: v.displayName,
      totalChampsWins: v.total,
    }))
    .sort((a, b) => {
      if (b.totalChampsWins !== a.totalChampsWins) {
        return b.totalChampsWins - a.totalChampsWins
      }
      return a.name.localeCompare(b.name)
    })
}

export function getLatestWeek(season: Season) {
  const sorted = [...season.weeks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  return sorted[0] ?? null
}

export function entryTeamLabel(e: WeekEntry): string {
  return formatTeamLabel(e.playerA, e.playerB)
}
