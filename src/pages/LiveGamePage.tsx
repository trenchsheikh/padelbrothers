import { Link } from 'react-router-dom'
import { Header } from '../components/Header'
import { LiveGame } from '../components/LiveGame'
import '../App.css'

export function LiveGamePage() {
  return (
    <div className="pb-app">
      <Header />
      <main className="pb-main pb-main--live">
        <p className="pb-live-back-wrap animate-in animate-delay-1">
          <Link to="/" className="pb-live-back">
            ← Back to leaderboards
          </Link>
        </p>
        <LiveGame />
      </main>
    </div>
  )
}
