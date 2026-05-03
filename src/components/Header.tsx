import { Link } from 'react-router-dom'
import './Header.css'

export interface HeaderBackLink {
  to: string
  label: string
}

interface HeaderProps {
  backLink?: HeaderBackLink
  variant?: 'default' | 'seasonFinale'
}

export function Header({ backLink, variant = 'default' }: HeaderProps) {
  const finale = variant === 'seasonFinale'

  return (
    <header className="pb-header animate-in">
      {backLink && (
        <p className="pb-header__back">
          <Link to={backLink.to}>{backLink.label}</Link>
        </p>
      )}
      <p className="pb-header__eyebrow">S3 Padel · Brent Cross</p>
      <h1 className="pb-header__title">PadelBrothers</h1>
      <p className="pb-header__tagline">
        {finale
          ? 'Season 4 is complete — final team & player standings below.'
          : 'Climb the courts. Hunt Champs. Bragging rights weekly.'}
      </p>

      <div className="pb-header__chips">
        <span className="pb-chip">Season 4</span>
        {finale ? (
          <span className="pb-chip pb-chip--accent">Complete</span>
        ) : (
          <span className="pb-chip">Sat 8–10pm</span>
        )}
      </div>
    </header>
  )
}
