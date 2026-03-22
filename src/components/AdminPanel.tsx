import { useMemo, useState } from 'react'
import type { Season, WeekEntry, WeekSession } from '../types'
import { parseTeamsPaste } from '../lib/parseTeamsPaste'
import { getNextSaturdays, shortSaturdayLabel } from '../lib/saturdays'
import './AdminPanel.css'

interface AdminPanelProps {
  open: boolean
  onClose: () => void
  season: Season
  onSave: (season: Season) => void
  onReset: () => void
}

function cloneSeason(s: Season): Season {
  return JSON.parse(JSON.stringify(s)) as Season
}

function newEntry(): WeekEntry {
  return {
    id: crypto.randomUUID(),
    playerA: '',
    playerB: '',
    champsWins: 0,
  }
}

function formatWeekLabel(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00')
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function sanitizeSeason(s: Season): Season {
  return {
    ...s,
    weeks: s.weeks.map((w) => ({
      ...w,
      entries: w.entries
        .map((e) => ({
          ...e,
          playerA: e.playerA.trim(),
          playerB: e.playerB.trim(),
          champsWins: Math.max(
            0,
            Math.min(999, Math.floor(Number(e.champsWins) || 0)),
          ),
        }))
        .filter((e) => e.playerA.length > 0 && e.playerB.length > 0),
    })),
  }
}

function validateSeason(s: Season): string | null {
  for (const w of s.weeks) {
    for (const e of w.entries) {
      const a = e.playerA.trim()
      const b = e.playerB.trim()
      if ((a && !b) || (!a && b)) {
        return 'Each team needs both player names filled in.'
      }
    }
  }
  if (s.weeks.some((w) => w.entries.length === 0)) {
    return 'Each session needs at least one team, or remove the empty session.'
  }
  return null
}

function initialSelectedWeekId(s: Season): string {
  const latest = [...s.weeks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0]
  return latest?.id ?? s.weeks[0]?.id ?? ''
}

export function AdminPanel({
  open,
  onClose,
  season,
  onSave,
  onReset,
}: AdminPanelProps) {
  const [draft, setDraft] = useState<Season>(() => cloneSeason(season))
  const [selectedWeekId, setSelectedWeekId] = useState(() =>
    initialSelectedWeekId(season),
  )
  const [error, setError] = useState<string | null>(null)
  const [pasteText, setPasteText] = useState('')

  const upcomingSaturdays = useMemo(() => getNextSaturdays(5), [])

  const sortedWeeks = useMemo(() => {
    return [...draft.weeks].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  }, [draft.weeks])

  const selectedWeek = draft.weeks.find((w) => w.id === selectedWeekId)

  if (!open) return null

  const updateWeek = (weekId: string, fn: (w: WeekSession) => WeekSession) => {
    setDraft((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) => (w.id === weekId ? fn(w) : w)),
    }))
  }

  const handlePickSaturday = (iso: string) => {
    setError(null)
    const hit = draft.weeks.find((w) => w.date === iso)
    if (hit) {
      setSelectedWeekId(hit.id)
      return
    }
    const w: WeekSession = {
      id: `week-${crypto.randomUUID()}`,
      date: iso,
      label: formatWeekLabel(iso),
      entries: [newEntry()],
    }
    setDraft((prev) => ({ ...prev, weeks: [...prev.weeks, w] }))
    setSelectedWeekId(w.id)
  }

  const handleAddTeam = () => {
    if (!selectedWeek) return
    updateWeek(selectedWeek.id, (w) => ({
      ...w,
      entries: [...w.entries, newEntry()],
    }))
  }

  const handleRemoveTeam = (entryId: string) => {
    if (!selectedWeek) return
    updateWeek(selectedWeek.id, (w) => ({
      ...w,
      entries: w.entries.filter((e) => e.id !== entryId),
    }))
  }

  const handleEntryChange = (
    entryId: string,
    field: keyof Pick<WeekEntry, 'playerA' | 'playerB' | 'champsWins'>,
    value: string | number,
  ) => {
    if (!selectedWeek) return
    updateWeek(selectedWeek.id, (w) => ({
      ...w,
      entries: w.entries.map((e) =>
        e.id === entryId ? { ...e, [field]: value } : e,
      ),
    }))
  }

  const handleWeekDateChange = (weekId: string, iso: string) => {
    setDraft((prev) => ({
      ...prev,
      weeks: prev.weeks.map((w) =>
        w.id === weekId
          ? { ...w, date: iso, label: formatWeekLabel(iso) }
          : w,
      ),
    }))
  }

  const handleApplyPaste = () => {
    if (!selectedWeek) return
    const pairs = parseTeamsPaste(pasteText)
    if (pairs.length === 0) {
      setError(
        'No teams parsed. Use one pair per line, e.g. Liban & Abdullah or Liban and Abdullah.',
      )
      return
    }
    setError(null)
    updateWeek(selectedWeek.id, (w) => ({
      ...w,
      entries: pairs.map((p) => ({
        id: crypto.randomUUID(),
        playerA: p.playerA,
        playerB: p.playerB,
        champsWins: 0,
      })),
    }))
    setPasteText('')
  }

  const handleAddWeek = () => {
    const iso = new Date().toISOString().slice(0, 10)
    const w: WeekSession = {
      id: `week-${crypto.randomUUID()}`,
      date: iso,
      label: formatWeekLabel(iso),
      entries: [newEntry()],
    }
    setDraft((prev) => ({ ...prev, weeks: [...prev.weeks, w] }))
    setSelectedWeekId(w.id)
  }

  const handleRemoveWeek = () => {
    if (!selectedWeek || draft.weeks.length <= 1) return
    if (
      !window.confirm(
        'Remove this session and all its teams? This cannot be undone.',
      )
    ) {
      return
    }
    const nextWeeks = draft.weeks.filter((w) => w.id !== selectedWeek.id)
    setDraft((prev) => ({ ...prev, weeks: nextWeeks }))
    const nextSel = [...nextWeeks].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )[0]
    setSelectedWeekId(nextSel?.id ?? '')
  }

  const handleSave = () => {
    const cleaned = sanitizeSeason(draft)
    const err = validateSeason(cleaned)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    onSave(cleaned)
    onClose()
  }

  const handleReset = () => {
    if (
      !window.confirm(
        'Reset all data to the original seed (21 Mar 2026)? Local changes will be lost.',
      )
    ) {
      return
    }
    setError(null)
    onReset()
    onClose()
  }

  return (
    <div className="pb-admin-overlay" role="dialog" aria-modal="true" aria-labelledby="admin-title">
      <div className="pb-admin-backdrop" onClick={onClose} aria-hidden />
      <div className="pb-admin-panel">
        <div className="pb-admin-panel__head">
          <h2 id="admin-title" className="pb-admin-panel__title">
            Admin
          </h2>
          <button
            type="button"
            className="pb-admin-close"
            onClick={onClose}
            aria-label="Close admin"
          >
            ✕
          </button>
        </div>

        <p className="pb-admin-lead">
          Sessions are Saturdays — tap a date below or pick from the list. Data
          stays in this browser only.
        </p>

        {error && (
          <div className="pb-admin-error" role="alert">
            {error}
          </div>
        )}

        <div className="pb-admin-field">
          <span className="pb-admin-label">Next 5 Saturdays</span>
          <div className="pb-admin-sat-row" role="group" aria-label="Upcoming sessions">
            {upcomingSaturdays.map((iso) => {
              const active = selectedWeek?.date === iso
              return (
                <button
                  key={iso}
                  type="button"
                  className={
                    active ? 'pb-admin-sat pb-admin-sat--active' : 'pb-admin-sat'
                  }
                  onClick={() => handlePickSaturday(iso)}
                >
                  {shortSaturdayLabel(iso)}
                </button>
              )
            })}
          </div>
        </div>

        <label className="pb-admin-field">
          <span className="pb-admin-label">Session</span>
          <select
            className="pb-admin-input"
            value={selectedWeekId}
            onChange={(e) => setSelectedWeekId(e.target.value)}
          >
            {sortedWeeks.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label} ({w.date})
              </option>
            ))}
          </select>
        </label>

        {selectedWeek && (
          <>
            <label className="pb-admin-field">
              <span className="pb-admin-label">Session date (custom)</span>
              <input
                className="pb-admin-input"
                type="date"
                value={selectedWeek.date}
                onChange={(e) =>
                  handleWeekDateChange(selectedWeek.id, e.target.value)
                }
              />
            </label>

            <div className="pb-admin-actions-row">
              <button
                type="button"
                className="pb-btn pb-btn--ghost"
                onClick={handleAddWeek}
              >
                + Add session
              </button>
              <button
                type="button"
                className="pb-btn pb-btn--ghost pb-btn--danger"
                onClick={handleRemoveWeek}
                disabled={draft.weeks.length <= 1}
              >
                Remove session
              </button>
            </div>

            <div className="pb-admin-paste">
              <span className="pb-admin-label">Paste full roster</span>
              <p className="pb-admin-paste__hint">
                One team per line: <code>Name & Name</code> or{' '}
                <code>Name and Name</code>. Replaces teams for this session (Champs
                wins reset — re-enter scores below).
              </p>
              <textarea
                className="pb-admin-textarea"
                rows={5}
                placeholder={`Liban & Abdullah\nSaleh & Abdul\nGuled & Faysal`}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                spellCheck={false}
              />
              <button
                type="button"
                className="pb-btn pb-btn--secondary"
                onClick={handleApplyPaste}
              >
                Apply paste to roster
              </button>
            </div>

            <div className="pb-admin-teams-head">
              <span className="pb-admin-label">Teams & Champs wins</span>
              <button
                type="button"
                className="pb-btn pb-btn--small"
                onClick={handleAddTeam}
              >
                + Add team
              </button>
            </div>

            <ul className="pb-admin-teams">
              {selectedWeek.entries.map((e) => (
                <li key={e.id} className="pb-admin-team">
                  <div className="pb-admin-team__names">
                    <input
                      className="pb-admin-input"
                      placeholder="Player A"
                      value={e.playerA}
                      onChange={(ev) =>
                        handleEntryChange(e.id, 'playerA', ev.target.value)
                      }
                      autoComplete="off"
                    />
                    <input
                      className="pb-admin-input"
                      placeholder="Player B"
                      value={e.playerB}
                      onChange={(ev) =>
                        handleEntryChange(e.id, 'playerB', ev.target.value)
                      }
                      autoComplete="off"
                    />
                  </div>
                  <div className="pb-admin-team__wins">
                    <label className="pb-admin-wins-label">
                      <span className="sr-only">Champs wins</span>
                      <input
                        className="pb-admin-input pb-admin-input--wins"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={999}
                        value={e.champsWins}
                        onChange={(ev) =>
                          handleEntryChange(
                            e.id,
                            'champsWins',
                            ev.target.value === ''
                              ? 0
                              : Number(ev.target.value),
                          )
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className="pb-btn pb-btn--icon"
                      onClick={() => handleRemoveTeam(e.id)}
                      aria-label="Remove team"
                      disabled={selectedWeek.entries.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="pb-admin-footer-actions">
          <button type="button" className="pb-btn pb-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="pb-btn pb-btn--warn" onClick={handleReset}>
            Reset to seed
          </button>
          <button type="button" className="pb-btn pb-btn--primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
