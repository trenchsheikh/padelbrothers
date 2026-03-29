import { useMemo, useRef } from 'react'
import type { Season } from '../types'
import { entryTeamLabel, getLatestWeek, getSortedWeeks } from '../lib/standings'
import { PastWeeksDialog } from './PastWeeksDialog'
import './SessionCard.css'

interface SessionCardProps {
  season: Season
}

export function SessionCard({ season }: SessionCardProps) {
  const week = getLatestWeek(season)
  const sortedWeeks = useMemo(() => getSortedWeeks(season), [season])
  const showPastWeeks = sortedWeeks.length > 1
  const pastDialogRef = useRef<HTMLDialogElement>(null)

  if (!week) return null

  const hasWins = week.entries.some((e) => e.champsWins > 0)

  return (
    <>
      <section
        className="pb-session animate-in animate-delay-3"
        aria-labelledby="session-heading"
      >
        <div className="pb-session__head">
          <h2 id="session-heading" className="pb-session__title">
            Latest session
          </h2>
          {showPastWeeks && (
            <button
              type="button"
              className="pb-session__past"
              onClick={() => pastDialogRef.current?.showModal()}
            >
              Past weeks
            </button>
          )}
        </div>
        <p className="pb-session__date">{week.label}</p>

        <ul className="pb-session__roster">
          {week.entries.map((e) => {
            const label = entryTeamLabel(e)
            const highlight = e.champsWins > 0
            return (
              <li
                key={e.id}
                className={
                  highlight
                    ? 'pb-session__pair pb-session__pair--hot'
                    : 'pb-session__pair'
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

      {showPastWeeks && (
        <PastWeeksDialog ref={pastDialogRef} season={season} />
      )}
    </>
  )
}
