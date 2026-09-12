import { useRef } from 'react'
import { Link } from 'react-router-dom'
import './WelcomePage.css'

// Set this to the club's official registration or community invitation URL.
const configuredJoinUrl = import.meta.env.VITE_COMMUNITY_URL?.trim()
const communityUrl = configuredJoinUrl && /^https:\/\//i.test(configuredJoinUrl)
  ? configuredJoinUrl
  : undefined

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

export function WelcomePage() {
  const joinDialog = useRef<HTMLDialogElement>(null)

  function joinLink(className: string, label: string) {
    return communityUrl ? (
      <a className={className} href={communityUrl}>{label} <Arrow /></a>
    ) : (
      <button className={className} type="button" onClick={() => joinDialog.current?.showModal()}>
        {label} <Arrow />
      </button>
    )
  }

  return (
    <div className="pb-landing">
      <a className="pb-landing__skip" href="#main">Skip to content</a>
      <header className="pb-landing__nav">
        <Link className="pb-landing__wordmark" to="/" aria-label="Padel Brothers home">Padel Brothers</Link>
        <nav aria-label="Main navigation">
          <a href="#community">Community</a>
          <a href="#seasons">Seasons</a>
          <Link to="/season-4">The ladder</Link>
        </nav>
        {joinLink('pb-landing__nav-join', 'Join the brothers')}
      </header>

      <main id="main">
        <div className="pb-landing__hero">
          <section className="pb-landing__intro" id="community" aria-labelledby="welcome-title">
            <p className="pb-landing__eyebrow">London padel. <span>Real brotherhood.</span></p>
            <h1 id="welcome-title">More than<br />a <span>game.</span></h1>
            <p className="pb-landing__description">
              Competitive on court. Brothers off it. Saturday nights, good games,
              and a community that keeps you coming back.
            </p>
            <div className="pb-landing__actions">
              {joinLink('pb-landing__button pb-landing__button--lime', 'Join the community')}
              <a className="pb-landing__button pb-landing__button--outline" href="#seasons">Explore the seasons</a>
            </div>
          </section>

          <section className="pb-landing__season" id="seasons" aria-labelledby="season-five-title">
            <p className="pb-landing__eyebrow">The next chapter</p>
            <span className="pb-landing__season-number" aria-hidden="true">05</span>
            <h2 id="season-five-title">Season five</h2>
            <div className="pb-landing__season-details">
              <p className="pb-landing__venue">S3 Finchley Padel Club</p>
              <p className="pb-landing__dates">October — December 2026</p>
              <p className="pb-landing__capacity">10 courts · 40 players every week</p>
              <p className="pb-landing__season-tagline">New courts. Same brotherhood.</p>
              <details className="pb-landing__details">
                <summary>Find out more <span aria-hidden="true">+</span></summary>
                <p>New courts, same chaos — everyone goes in the spinner, pairs shuffle,
                  and transfers keep the ladder honest. More courts, more runs at Champs,
                  more bragging rights. Watch this space for the first Finchley dates.</p>
              </details>
            </div>
          </section>
        </div>

        <div className="pb-landing__values" aria-label="Our community values">
          <span>Play together.</span><i aria-hidden="true">/</i>
          <span>Compete together.</span><i aria-hidden="true">/</i>
          <span>Grow together.</span>
        </div>

        <section className="pb-landing__archive" aria-labelledby="season-four-title">
          <div>
            <p className="pb-landing__eyebrow">Previous season</p>
            <h2 id="season-four-title">Brent Cross,<br />in the books.</h2>
          </div>
          <div className="pb-landing__archive-copy">
            <p>Season 4 brought the noise. Explore the teams, players,
              and week-by-week history.</p>
            <Link className="pb-landing__button pb-landing__button--green" to="/season-4">View Season 4 <Arrow /></Link>
          </div>
          <p className="pb-landing__signoff">Same<br />players.<br />Higher<br />standards.</p>
        </section>
      </main>

      <footer className="pb-landing__footer">
        <span>Padel Brothers · London</span>
        <span>Good games. Great company.</span>
        <Link to="/live">Live game <Arrow /></Link>
      </footer>

      <dialog ref={joinDialog} className="pb-landing__dialog" aria-labelledby="join-title"
        onClick={(event) => { if (event.target === event.currentTarget) joinDialog.current?.close() }}>
        <form method="dialog">
          <button className="pb-landing__close" aria-label="Close community details">×</button>
        </form>
        <p className="pb-landing__eyebrow">You’re in good company</p>
        <h2 id="join-title">Join the brothers.</h2>
        <p>Good games, fresh pairs, and Saturday nights worth talking about all week.</p>
        <p>Community registration details haven’t been published here yet. Check back for the next announcement.</p>
        <form method="dialog"><button className="pb-landing__button pb-landing__button--lime">Got it <Arrow /></button></form>
      </dialog>
    </div>
  )
}
