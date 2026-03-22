import './Header.css'

export function Header() {
  return (
    <header className="pb-header animate-in">
      <p className="pb-header__eyebrow">S3 Padel · Brent Cross</p>
      <h1 className="pb-header__title">PadelBrothers</h1>
      <p className="pb-header__tagline">
        Climb the courts. Hunt Champs. Bragging rights weekly.
      </p>

      <div className="pb-header__chips">
        <span className="pb-chip">Season 4</span>
        <span className="pb-chip">Sat 8–10pm</span>
      </div>
    </header>
  )
}
