import { useId, useState } from 'react'
import { ADMIN_PASSWORD } from '../lib/adminPassword'
import './AdminPasswordModal.css'

interface AdminPasswordModalProps {
  open: boolean
  onSuccess: () => void
  onCancel: () => void
}

export function AdminPasswordModal({
  open,
  onSuccess,
  onCancel,
}: AdminPasswordModalProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const id = useId()

  if (!open) return null

  const submit = () => {
    if (value === ADMIN_PASSWORD) {
      setError(false)
      setValue('')
      onSuccess()
      return
    }
    setError(true)
  }

  return (
    <div className="pb-pw-overlay" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`}>
      <div className="pb-pw-backdrop" onClick={onCancel} aria-hidden />
      <div className="pb-pw-panel">
        <h2 id={`${id}-title`} className="pb-pw-title">
          Admin access
        </h2>
        <p className="pb-pw-hint">Enter the admin password to continue.</p>

        <label className="pb-pw-field" htmlFor={`${id}-input`}>
          <span className="pb-pw-label">Password</span>
          <input
            id={`${id}-input`}
            className="pb-pw-input"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
            }}
          />
        </label>

        {error && (
          <p className="pb-pw-error" role="alert">
            Incorrect password.
          </p>
        )}

        <div className="pb-pw-actions">
          <button type="button" className="pb-pw-btn pb-pw-btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="pb-pw-btn pb-pw-btn--primary" onClick={submit}>
            Unlock
          </button>
        </div>
      </div>
    </div>
  )
}
