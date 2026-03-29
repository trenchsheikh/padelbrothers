import {
  type DragEvent,
  type FormEvent,
  useRef,
  useState,
} from 'react'
import { useLiveSession } from '../hooks/useLiveSession'
import { MAX_ROUNDS } from '../lib/liveStorage'
import {
  getDragPayload,
  setDragPayload,
  type DragSource,
} from '../lib/liveTeamMove'
import type { CourtSide } from '../types/liveSession'
import './LiveGame.css'

function dragOver(e: DragEvent<HTMLElement>) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}

export function LiveGame() {
  const {
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
    maxRoundsReached,
  } = useLiveSession()

  const { courts, round, pendingWinners, lineupLocked, teamPool } = bundle
  const [teamDraft, setTeamDraft] = useState('')
  /** Fallback when dataTransfer.getData is empty in some browsers */
  const dragSourceRef = useRef<DragSource | null>(null)

  const clearDragSource = () => {
    dragSourceRef.current = null
  }

  const resolveDragSource = (e: DragEvent<HTMLElement>): DragSource | null =>
    getDragPayload(e) ?? dragSourceRef.current

  const recordWinner = (courtIndex: number, side: CourtSide) => {
    const c = courts[courtIndex]
    const winner = side === 'home' ? c.home.trim() : c.away.trim()
    const loser = side === 'home' ? c.away.trim() : c.home.trim()
    if (!winner || !loser) {
      window.alert('Place two teams on this court first (drag from bench or type).')
      return
    }
    const label = side === 'home' ? c.home : c.away
    const other = side === 'home' ? c.away : c.home
    const ok = window.confirm(
      `Confirm result for Court ${courtIndex + 1}:\n\nWinner: ${label}\nLoser: ${other}`,
    )
    if (!ok) return
    setPendingWinner(courtIndex, side)
  }

  const onApplyRound = () => {
    if (!canApplyRound) return
    const ok = window.confirm(
      'Apply this round? Team positions will update for all 9 courts.',
    )
    if (!ok) return
    applyRoundAndAdvance()
  }

  const onReset = () => {
    const ok = window.confirm(
      'Reset the live session? All courts, bench, and round progress will be cleared.',
    )
    if (!ok) return
    resetSession()
  }

  const onAddTeamsSubmit = (e: FormEvent) => {
    e.preventDefault()
    addTeamsFromPaste(teamDraft)
    setTeamDraft('')
  }

  const handleDropPool = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const from = resolveDragSource(e)
    clearDragSource()
    if (!from) return
    if (from.type === 'pool') return
    moveTeam(from, { type: 'pool' })
  }

  const handleDropSlot =
    (courtIndex: number, side: CourtSide) =>
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const from = resolveDragSource(e)
      clearDragSource()
      if (!from) return
      moveTeam(from, { type: 'court', courtIndex, side })
    }

  const onDragStartPool = (index: number) => (e: DragEvent<HTMLElement>) => {
    if (lineupLocked) {
      e.preventDefault()
      return
    }
    const src: DragSource = { type: 'pool', index }
    dragSourceRef.current = src
    setDragPayload(e, src)
  }

  const onDragStartCourt =
    (courtIndex: number, side: CourtSide) =>
    (e: DragEvent<HTMLElement>) => {
      if (lineupLocked) {
        e.preventDefault()
        return
      }
      const team =
        side === 'home' ? courts[courtIndex].home : courts[courtIndex].away
      if (!team.trim()) {
        e.preventDefault()
        return
      }
      const src: DragSource = { type: 'court', courtIndex, side }
      dragSourceRef.current = src
      setDragPayload(e, src)
    }

  return (
    <section
      className="pb-live animate-in animate-delay-2"
      aria-labelledby="live-heading"
    >
      <div className="pb-live__intro">
        <h2 id="live-heading" className="pb-live__title">
          Live session
        </h2>
        <p className="pb-live__lede">
          Court 1 is the top of the ladder. Add teams below (names with &amp;),
          drag bench chips onto Team A / Team B, or use the grip beside a slot
          to move a team between courts or back to the bench. Then record
          results and apply the round.
        </p>
        <div className="pb-live__toolbar">
          <label className="pb-live__lock">
            <input
              type="checkbox"
              checked={lineupLocked}
              onChange={(e) => setLineupLocked(e.target.checked)}
            />
            Lock lineup
          </label>
          <span className="pb-live__round">
            Round {round} / {MAX_ROUNDS}
          </span>
          {maxRoundsReached && (
            <span className="pb-live__max">
              Session complete — reset to start over.
            </span>
          )}
        </div>
      </div>

      <div className="pb-live__layout">
        <aside className="pb-live__dock">
          <form className="pb-live__form" onSubmit={onAddTeamsSubmit}>
            <h3 className="pb-live__dock-title">Add teams</h3>
            <p className="pb-live__hint">
              One team per line: <code>Player A &amp; Player B</code>
            </p>
            <textarea
              className="pb-live__textarea"
              value={teamDraft}
              onChange={(e) => setTeamDraft(e.target.value)}
              placeholder={
                'Ada & Ben\nChris & Dana\n…'
              }
              rows={5}
              disabled={lineupLocked}
              spellCheck={false}
            />
            <button
              type="submit"
              className="pb-live__btn pb-live__btn--primary pb-live__form-submit"
              disabled={lineupLocked || !teamDraft.trim()}
            >
              Add to bench
            </button>
          </form>

          <div
            className="pb-live__bench"
            onDragOver={dragOver}
            onDrop={handleDropPool}
          >
            <h3 className="pb-live__dock-title">Bench</h3>
            <p className="pb-live__hint pb-live__hint--bench">
              Drag teams onto courts. Drag from a court back here to unassign.
            </p>
            <div
              className="pb-live__chips"
              role="list"
              onDragOver={dragOver}
              onDrop={handleDropPool}
            >
              {teamPool.length === 0 ? (
                <p
                  className="pb-live__bench-empty"
                  onDragOver={dragOver}
                  onDrop={handleDropPool}
                >
                  No teams on the bench.
                </p>
              ) : (
                teamPool.map((team, i) => (
                  <div
                    key={`pool-${i}-${team.slice(0, 24)}`}
                    className="pb-live__chip"
                    role="listitem"
                    draggable={!lineupLocked}
                    onDragStart={onDragStartPool(i)}
                    onDragEnd={clearDragSource}
                    onDragOver={dragOver}
                    onDrop={handleDropPool}
                  >
                    {team}
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <div className="pb-live__courts-wrap">
          <ol className="pb-live__courts" start={1}>
            {courts.map((court, i) => {
              const pending = pendingWinners[i]
              const disabled = lineupLocked
              return (
                <li key={i} className="pb-live__court">
                  <div className="pb-live__court-head">
                    <span className="pb-live__court-label">Court {i + 1}</span>
                    {pending !== null && (
                      <span className="pb-live__pending">
                        Pending:{' '}
                        <strong>
                          {pending === 'home' ? court.home : court.away}
                        </strong>{' '}
                        won
                      </span>
                    )}
                  </div>
                  <div className="pb-live__court-grid">
                    <div
                      className="pb-live__slot"
                      onDragOver={dragOver}
                      onDrop={handleDropSlot(i, 'home')}
                    >
                      <label
                        className="pb-live__field-label"
                        htmlFor={`home-${i}`}
                        onDragOver={dragOver}
                        onDrop={handleDropSlot(i, 'home')}
                      >
                        Team A
                      </label>
                      <div
                        className="pb-live__slot-row"
                        onDragOver={dragOver}
                        onDrop={handleDropSlot(i, 'home')}
                      >
                        <button
                          type="button"
                          className="pb-live__grip"
                          aria-label="Drag team A to another slot or bench"
                          disabled={disabled || !court.home.trim()}
                          draggable={!disabled && !!court.home.trim()}
                          onDragStart={onDragStartCourt(i, 'home')}
                          onDragEnd={clearDragSource}
                          onDragOver={dragOver}
                          onDrop={handleDropSlot(i, 'home')}
                        >
                          ≡
                        </button>
                        <input
                          id={`home-${i}`}
                          className="pb-live__input pb-live__input--grow"
                          value={court.home}
                          disabled={disabled}
                          onChange={(e) =>
                            updateCourt(i, { home: e.target.value })
                          }
                          placeholder="Drop or type"
                          autoComplete="off"
                          onDragOver={dragOver}
                          onDrop={handleDropSlot(i, 'home')}
                        />
                      </div>
                    </div>
                    <div className="pb-live__vs">
                      <span className="pb-live__vs-text">vs</span>
                    </div>
                    <div
                      className="pb-live__slot"
                      onDragOver={dragOver}
                      onDrop={handleDropSlot(i, 'away')}
                    >
                      <label
                        className="pb-live__field-label"
                        htmlFor={`away-${i}`}
                        onDragOver={dragOver}
                        onDrop={handleDropSlot(i, 'away')}
                      >
                        Team B
                      </label>
                      <div
                        className="pb-live__slot-row"
                        onDragOver={dragOver}
                        onDrop={handleDropSlot(i, 'away')}
                      >
                        <button
                          type="button"
                          className="pb-live__grip"
                          aria-label="Drag team B to another slot or bench"
                          disabled={disabled || !court.away.trim()}
                          draggable={!disabled && !!court.away.trim()}
                          onDragStart={onDragStartCourt(i, 'away')}
                          onDragEnd={clearDragSource}
                          onDragOver={dragOver}
                          onDrop={handleDropSlot(i, 'away')}
                        >
                          ≡
                        </button>
                        <input
                          id={`away-${i}`}
                          className="pb-live__input pb-live__input--grow"
                          value={court.away}
                          disabled={disabled}
                          onChange={(e) =>
                            updateCourt(i, { away: e.target.value })
                          }
                          placeholder="Drop or type"
                          autoComplete="off"
                          onDragOver={dragOver}
                          onDrop={handleDropSlot(i, 'away')}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pb-live__actions">
                    <button
                      type="button"
                      className="pb-live__btn"
                      disabled={maxRoundsReached || pending === 'home'}
                      onClick={() => recordWinner(i, 'home')}
                    >
                      {court.home.trim() ? `${court.home} won` : 'Team A won'}
                    </button>
                    <button
                      type="button"
                      className="pb-live__btn"
                      disabled={maxRoundsReached || pending === 'away'}
                      onClick={() => recordWinner(i, 'away')}
                    >
                      {court.away.trim() ? `${court.away} won` : 'Team B won'}
                    </button>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="pb-live__footer-actions">
        <button
          type="button"
          className="pb-live__btn pb-live__btn--ghost"
          onClick={clearPending}
          disabled={maxRoundsReached || !pendingWinners.some(Boolean)}
        >
          Clear pending picks
        </button>
        <button
          type="button"
          className="pb-live__btn pb-live__btn--primary"
          onClick={onApplyRound}
          disabled={!canApplyRound || maxRoundsReached}
        >
          Apply round
        </button>
        <button
          type="button"
          className="pb-live__btn pb-live__btn--danger"
          onClick={onReset}
        >
          Reset session
        </button>
      </div>
    </section>
  )
}
