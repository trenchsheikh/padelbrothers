import type { Season } from '../types'
import { entryTeamLabel, getLatestWeek } from '../lib/standings'
import './SessionCard.css'

interface SessionCardProps {
  season: Season
}

export function SessionCard({ season }: SessionCardProps) {
  const week = getLatestWeek(season)
  if (!week) return null

  const hasWins = week.entries.some((e) => e.champsWins > 0)

  return (
    <section
      className="pb-session animate-in animate-delay-3"
      aria-labelledby="session-heading"
    >
      <h2 id="session-heading" className="pb-session__title">
        Latest session
      </h2>
      <p className="pb-session__date">{week.label}</p>

      <ul className="pb-session__roster">
        {week.entries.map((e) => {
          const label = entryTeamLabel(e)
          const highlight = e.champsWins > 0
          return (
            <li
              key={e.id}
              className={
                highlight ? 'pb-session__pair pb-session__pair--hot' : 'pb-session__pair'
              }
            >
              <span className="pb-session__pair-name">{label}</span>
              {highlight ? (
                <span className="pb-session__pair-wins">
                  {e.champsWins} Champs {e.champsWins === 1 ? 'win' : 'wins'}
                </span>
              ) : (
                <span className="pb-session__pair-dash">—</span>
              )}
            </li>
          )
        })}
      </ul>

      {!hasWins && (
        <p className="pb-session__hint">
          Champs wins for this week are not recorded yet — use{' '}
          <strong>Admin</strong> to add scores.
        </p>
      )}
    </section>
  )
}
