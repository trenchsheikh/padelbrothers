import { useLayoutEffect, useMemo, useState } from 'react'
import { AdminPasswordModal } from '../components/AdminPasswordModal'
import { AdminPanel } from '../components/AdminPanel'
import { FooterBar } from '../components/FooterBar'
import { Link } from 'react-router-dom'
import {
  Leaderboard,
  type LeaderboardTab,
} from '../components/Leaderboard'
import { Rules } from '../components/Rules'
import { SessionCard } from '../components/SessionCard'
import { useSeasonState } from '../hooks/useSeasonState'
import { getPlayerStandings, getTeamStandings } from '../lib/standings'
import '../App.css'
import './HomePage.css'

export function HomePage() {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const { season, updatedAt, saveSeason, resetToSeed } = useSeasonState()
  const [tab, setTab] = useState<LeaderboardTab>('teams')
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminKey, setAdminKey] = useState(0)
  const [adminPasswordOpen, setAdminPasswordOpen] = useState(false)

  const teamRows = useMemo(() => getTeamStandings(season), [season])
  const playerRows = useMemo(() => getPlayerStandings(season), [season])

  return (
    <div className="pb-app pb-season-page">
      <a className="pb-season-page__skip" href="#standings">Skip to standings</a>
      <header className="pb-season-page__nav">
        <Link to="/" className="pb-season-page__brand">Padel Brothers</Link>
        <nav aria-label="Main navigation">
          <a href="/#community">Community</a>
          <a href="/#seasons">Seasons</a>
          <Link to="/season-4" aria-current="page">The ladder</Link>
        </nav>
        <Link to="/" className="pb-season-page__back">Home</Link>
      </header>
      <main id="standings">
        <div className="pb-season-page__hero">
          <div>
            <p className="pb-season-page__eyebrow">S3 Brent Cross · Season complete</p>
            <h1>The final ladder.</h1>
            <p className="pb-season-page__subtitle">Season 4 / Final team &amp; player standings</p>
          </div>
          <div className="pb-season-page__number" aria-hidden="true"><span>Season</span>04</div>
        </div>
        <div className="pb-season-page__grid">
          <Leaderboard
            tab={tab}
            onTabChange={setTab}
            teamRows={teamRows}
            playerRows={playerRows}
          />
          <aside className="pb-season-page__sidebar" aria-label="Season information">
            <Rules />
            <SessionCard season={season} />
            <p className="pb-season-page__signoff">Final totals. Big games. Bigger bragging rights.</p>
          </aside>
        </div>
      </main>
      <FooterBar
        updatedAt={updatedAt}
        onAdminClick={() => setAdminPasswordOpen(true)}
      />

      <AdminPasswordModal
        open={adminPasswordOpen}
        onCancel={() => setAdminPasswordOpen(false)}
        onSuccess={() => {
          setAdminPasswordOpen(false)
          setAdminKey((k) => k + 1)
          setAdminOpen(true)
        }}
      />

      <AdminPanel
        key={adminKey}
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        season={season}
        onSave={saveSeason}
        onReset={resetToSeed}
      />
    </div>
  )
}
