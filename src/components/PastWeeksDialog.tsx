import {
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Season } from '../types'
import { entryTeamLabel, getSortedWeeks } from '../lib/standings'
import './PastWeeksDialog.css'

interface PastWeeksDialogProps {
  season: Season
}

export const PastWeeksDialog = forwardRef<HTMLDialogElement, PastWeeksDialogProps>(
  function PastWeeksDialog({ season }, ref) {
    const weeks = useMemo(() => getSortedWeeks(season), [season])
    const [selectedId, setSelectedId] = useState('')

    useEffect(() => {
      const w0 = weeks[0]
      if (!w0) return
      setSelectedId((id) =>
        id && weeks.some((w) => w.id === id) ? id : w0.id,
      )
    }, [weeks])

    const selected = weeks.find((w) => w.id === selectedId) ?? weeks[0]
    const hasWins =
      selected?.entries.some((e) => e.champsWins > 0) ?? false

    return (
      <dialog ref={ref} className="pb-past" aria-labelledby="past-weeks-title">
        <div className="pb-past__inner">
          <header className="pb-past__head">
            <h2 id="past-weeks-title" className="pb-past__title">
              Session history
            </h2>
            <form method="dialog">
              <button type="submit" className="pb-past__close">
                Close
              </button>
            </form>
          </header>

          <p className="pb-past__lede">
            Pick a week to see who played and Champs wins for that night.
          </p>

          <div
            className="pb-past__chips"
            role="tablist"
            aria-label="Week"
          >
            {weeks.map((w) => (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={selectedId === w.id}
                className={
                  selectedId === w.id
                    ? 'pb-past__chip pb-past__chip--active'
                    : 'pb-past__chip'
                }
                onClick={() => setSelectedId(w.id)}
              >
                {w.label}
              </button>
            ))}
          </div>

          {selected && (
            <>
              <p className="pb-past__date">{selected.label}</p>
              <ul className="pb-past__roster">
                {selected.entries.map((e) => {
                  const label = entryTeamLabel(e)
                  const highlight = e.champsWins > 0
                  return (
                    <li
                      key={e.id}
                      className={
                        highlight
                          ? 'pb-past__pair pb-past__pair--hot'
                          : 'pb-past__pair'
                      }
                    >
                      <span className="pb-past__pair-name">{label}</span>
                      {highlight ? (
                        <span className="pb-past__pair-wins">
                          {e.champsWins} Champs{' '}
                          {e.champsWins === 1 ? 'win' : 'wins'}
                        </span>
                      ) : (
                        <span className="pb-past__pair-dash">—</span>
                      )}
                    </li>
                  )
                })}
              </ul>
              {!hasWins && (
                <p className="pb-past__hint">
                  No Champs wins recorded for this week.
                </p>
              )}
            </>
          )}
        </div>
      </dialog>
    )
  },
)
