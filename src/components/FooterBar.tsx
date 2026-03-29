import { Link } from 'react-router-dom'
import './FooterBar.css'

interface FooterBarProps {
  updatedAt: string
  onAdminClick: () => void
}

export function FooterBar({ updatedAt, onAdminClick }: FooterBarProps) {
  const formatted = new Date(updatedAt).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <footer className="pb-footer animate-in animate-delay-5">
      <p className="pb-footer__meta">
        <span className="pb-footer__updated">Last updated · {formatted}</span>
      </p>
      <div className="pb-footer__actions">
        <Link to="/live" className="pb-footer__live">
          Live game
        </Link>
        <button
          type="button"
          className="pb-footer__admin"
          onClick={onAdminClick}
        >
          Admin
        </button>
      </div>
    </footer>
  )
}
