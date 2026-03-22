import type { PlayerStandingRow, TeamStandingRow } from '../lib/standings'
import './Leaderboard.css'

export type LeaderboardTab = 'teams' | 'players'

interface LeaderboardProps {
  tab: LeaderboardTab
  onTabChange: (t: LeaderboardTab) => void
  teamRows: TeamStandingRow[]
  playerRows: PlayerStandingRow[]
}

export function Leaderboard({
  tab,
  onTabChange,
  teamRows,
  playerRows,
}: LeaderboardProps) {
  return (
    <section
      className="pb-lb animate-in animate-delay-2"
      aria-labelledby="lb-heading"
    >
      <div className="pb-lb__head">
        <h2 id="lb-heading" className="pb-lb__title">
          Leaderboards
        </h2>
        <div
          className="pb-seg"
          role="tablist"
          aria-label="Leaderboard type"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'teams'}
            className={`pb-seg__btn${tab === 'teams' ? ' pb-seg__btn--active' : ''}`}
            onClick={() => onTabChange('teams')}
          >
            Teams
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'players'}
            className={`pb-seg__btn${tab === 'players' ? ' pb-seg__btn--active' : ''}`}
            onClick={() => onTabChange('players')}
          >
            Players
          </button>
        </div>
      </div>

      {tab === 'teams' ? (
        <LeaderTable
          rows={teamRows.map((r, i) => ({
            rank: i + 1,
            primary: r.label,
            wins: r.totalChampsWins,
          }))}
          primaryLabel="Team"
        />
      ) : (
        <LeaderTable
          rows={playerRows.map((r, i) => ({
            rank: i + 1,
            primary: r.name,
            wins: r.totalChampsWins,
          }))}
          primaryLabel="Player"
        />
      )}
      <p className="pb-lb__note">
        Totals are <strong>Champs court wins</strong> across Season 4 sessions
        recorded below.
      </p>
    </section>
  )
}

function LeaderTable({
  rows,
  primaryLabel,
}: {
  rows: { rank: number; primary: string; wins: number }[]
  primaryLabel: string
}) {
  if (rows.length === 0) {
    return (
      <p className="pb-lb__empty">No results yet — add a session in Admin.</p>
    )
  }

  return (
    <>
      <div className="pb-lb__table-wrap" role="table" aria-label="Standings">
        <div className="pb-lb__thead" role="rowgroup">
          <div className="pb-lb__tr pb-lb__tr--head" role="row">
            <span role="columnheader">#</span>
            <span role="columnheader">{primaryLabel}</span>
            <span role="columnheader" className="pb-lb__col-wins">
              Champs
            </span>
          </div>
        </div>
        <div className="pb-lb__tbody" role="rowgroup">
          {rows.map((r, i) => (
            <div key={`${i}-${r.primary}`} className="pb-lb__tr" role="row">
              <span className="pb-lb__rank" role="cell">
                {r.rank}
              </span>
              <span role="cell">{r.primary}</span>
              <span className="pb-lb__col-wins" role="cell">
                {r.wins}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ul className="pb-lb__cards" aria-label="Standings cards">
        {rows.map((r, i) => (
          <li key={`${i}-${r.primary}`} className="pb-lb__card">
            <span className="pb-lb__card-rank">{r.rank}</span>
            <div className="pb-lb__card-main">
              <span className="pb-lb__card-name">{r.primary}</span>
              <span className="pb-lb__card-meta">
                {primaryLabel} · Champs wins
              </span>
            </div>
            <span className="pb-lb__card-wins">{r.wins}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
