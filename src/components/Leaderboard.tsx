import { useState, type KeyboardEvent } from 'react'
import type { PlayerStandingRow, TeamStandingRow } from '../lib/standings'
import './Leaderboard.css'

export type LeaderboardTab = 'teams' | 'players'
interface LeaderboardProps {
  tab: LeaderboardTab
  onTabChange: (tab: LeaderboardTab) => void
  teamRows: TeamStandingRow[]
  playerRows: PlayerStandingRow[]
}
const PAGE_SIZE = 8

export function Leaderboard({ tab, onTabChange, teamRows, playerRows }: LeaderboardProps) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const rows = tab === 'teams'
    ? teamRows.map((row, index) => ({ key: row.key, rank: index + 1, name: row.label, wins: row.totalChampsWins }))
    : playerRows.map((row, index) => ({ key: row.name, rank: index + 1, name: row.name, wins: row.totalChampsWins }))
  const filtered = rows.filter(row => row.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visibleRows = filtered.slice(start, start + PAGE_SIZE)
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)
    .filter(n => n === 1 || n === pageCount || Math.abs(n - currentPage) <= 1)

  function selectTab(next: LeaderboardTab) {
    onTabChange(next)
    setQuery('')
    setPage(1)
  }
  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 'teams' : event.key === 'End' ? 'players' : tab === 'teams' ? 'players' : 'teams'
    selectTab(next)
    document.getElementById(`lb-tab-${next}`)?.focus()
  }

  return (
    <section className="pb-lb" aria-labelledby="lb-heading">
      <h2 id="lb-heading">Leaderboard</h2>
      <p className="pb-lb__subtitle">Every Champs win. Every place earned.</p>
      <div className="pb-lb__controls">
        <div className="pb-seg" role="tablist" aria-label="Leaderboard type">
          {(['teams', 'players'] as const).map(value => (
            <button key={value} id={`lb-tab-${value}`} type="button" role="tab"
              aria-selected={tab === value} aria-controls="lb-results" tabIndex={tab === value ? 0 : -1}
              className={`pb-seg__btn${tab === value ? ' pb-seg__btn--active' : ''}`}
              onKeyDown={handleTabKey} onClick={() => selectTab(value)}>
              {value === 'teams' ? 'Teams' : 'Players'}
            </button>
          ))}
        </div>
        <label className="pb-lb__search">
          <span className="sr-only">Search {tab}</span>
          <input type="search" placeholder={`Search ${tab}`} value={query}
            onChange={event => { setQuery(event.target.value); setPage(1) }} />
        </label>
      </div>
      <div id="lb-results" role="tabpanel" aria-labelledby={`lb-tab-${tab}`} tabIndex={0}>
        <table className="pb-lb__table" aria-label={`${tab === 'teams' ? 'Team' : 'Player'} standings`}>
          <thead><tr><th scope="col">#</th><th scope="col">{tab === 'teams' ? 'Team' : 'Player'}</th><th scope="col">Champs wins</th></tr></thead>
          <tbody>
            {visibleRows.map(row => (
              <tr key={row.key} className={row.rank === 1 ? 'pb-lb__leader' : undefined}>
                <td>{String(row.rank).padStart(2, '0')}</td><th scope="row">{row.name}</th><td>{row.wins}</td>
              </tr>
            ))}
            {visibleRows.length === 0 && <tr><td colSpan={3} className="pb-lb__empty">
              {rows.length === 0 ? 'No results recorded yet.' : 'No matches. Try another name.'}
            </td></tr>}
          </tbody>
        </table>
        <div className="pb-lb__pagination">
          <p role="status">{filtered.length ? `Showing ${start + 1}–${start + visibleRows.length} of ${filtered.length} ${tab}` : `0 ${tab}`}</p>
          <nav aria-label="Leaderboard pages">
            <button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>
            {pages.map((number, index) => (
              <span key={number} className="pb-lb__page-item">
                {index > 0 && number - pages[index - 1] > 1 && <span aria-hidden="true" className="pb-lb__ellipsis">…</span>}
                <button type="button" aria-label={`Page ${number}`} aria-current={number === currentPage ? 'page' : undefined} onClick={() => setPage(number)}>{number}</button>
              </span>
            ))}
            <button type="button" aria-label="Next page" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>›</button>
          </nav>
        </div>
      </div>
      <p className="pb-lb__note">Final totals: Champs court wins across every recorded Season 4 week.</p>
    </section>
  )
}
