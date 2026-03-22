export interface WeekEntry {
  id: string
  playerA: string
  playerB: string
  champsWins: number
}

export interface WeekSession {
  id: string
  date: string
  label: string
  entries: WeekEntry[]
}

export interface Season {
  id: string
  number: number
  label: string
  weeks: WeekSession[]
}

export interface PersistedBundle {
  season: Season
  updatedAt: string
}
