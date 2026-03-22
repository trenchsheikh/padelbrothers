import { useMemo, useState } from 'react'
import { AdminPasswordModal } from './components/AdminPasswordModal'
import { AdminPanel } from './components/AdminPanel'
import { FooterBar } from './components/FooterBar'
import { Header } from './components/Header'
import {
  Leaderboard,
  type LeaderboardTab,
} from './components/Leaderboard'
import { Rules } from './components/Rules'
import { SessionCard } from './components/SessionCard'
import { useSeasonState } from './hooks/useSeasonState'
import { getPlayerStandings, getTeamStandings } from './lib/standings'
import './App.css'

function App() {
  const { season, updatedAt, saveSeason, resetToSeed } = useSeasonState()
  const [tab, setTab] = useState<LeaderboardTab>('teams')
  const [adminOpen, setAdminOpen] = useState(false)
  const [adminKey, setAdminKey] = useState(0)
  const [adminPasswordOpen, setAdminPasswordOpen] = useState(false)

  const teamRows = useMemo(() => getTeamStandings(season), [season])
  const playerRows = useMemo(() => getPlayerStandings(season), [season])

  return (
    <div className="pb-app">
      <Header />
      <main className="pb-main">
        <Rules />
        <Leaderboard
          tab={tab}
          onTabChange={setTab}
          teamRows={teamRows}
          playerRows={playerRows}
        />
        <SessionCard season={season} />
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

export default App
