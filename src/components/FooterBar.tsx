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
      <button
        type="button"
        className="pb-footer__admin"
        onClick={onAdminClick}
      >
        Admin
      </button>
    </footer>
  )
}
