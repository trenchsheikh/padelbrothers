import { Link } from 'react-router-dom'
import '../App.css'
import './WelcomePage.css'

export function WelcomePage() {
  return (
    <div className="pb-app pb-welcome-app">
      <main className="pb-welcome">
        <p className="pb-welcome__kicker animate-in">
          Brent Cross · Season 4 in the books
        </p>

        <h1 className="pb-welcome__brand animate-in animate-delay-1">
          <span className="pb-welcome__brand-line">Padel</span>
          <span className="pb-welcome__brand-line pb-welcome__brand-line--accent">
            Brothers
          </span>
        </h1>

        <p className="pb-welcome__hook animate-in animate-delay-2">
          Huge thanks to everyone who showed up Saturday nights and made the
          ladder at <strong>S3 Brent Cross</strong> competitive, loud, and
          worth talking about all week. That run is done —{' '}
          <strong>the next chapter is loading.</strong>
        </p>

        <section
          className="pb-welcome__hype animate-in animate-delay-3"
          aria-labelledby="s5-title"
        >
          <p className="pb-welcome__hype-label">Incoming</p>
          <h2 className="pb-welcome__hype-season" id="s5-title">
            Season 5
          </h2>
          <p className="pb-welcome__hype-venue">
            S3 Finchley Padel Club
          </p>
          <p className="pb-welcome__hype-when">June · July 2026</p>
          <p className="pb-welcome__hype-copy">
            New courts, same chaos — everyone goes in the{' '}
            <strong>spinner</strong>, pairs shuffle, and{' '}
            <strong>transfers</strong> keep the ladder honest. Be ready when we
            drop the first Finchley dates — more courts, more runs at Champs,
            more bragging rights.
          </p>
        </section>

        <div className="pb-welcome__cta-wrap animate-in animate-delay-4">
          <Link to="/season-4" className="pb-welcome__cta">
            See Season 4 — teams &amp; players
          </Link>
          <p className="pb-welcome__cta-hint">
            Full Champs totals and week-by-week history — proof of how hard
            Brent Cross went.
          </p>
        </div>
      </main>
    </div>
  )
}
