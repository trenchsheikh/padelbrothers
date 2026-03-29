export type CourtSide = 'home' | 'away'

export interface CourtTeams {
  home: string
  away: string
}

export interface LiveSessionBundle {
  courts: CourtTeams[]
  /** Teams not yet placed on a court (label: "A & B") */
  teamPool: string[]
  round: number
  /** Winner per court for the round in progress; null until chosen */
  pendingWinners: (CourtSide | null)[]
  lineupLocked: boolean
  updatedAt: string
}
