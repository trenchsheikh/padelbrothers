/** Local calendar date as YYYY-MM-DD (no UTC shift). */
export function toISODateLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Advance `d` (mutated) to the next Saturday on or after its calendar day. */
export function moveToNextSaturday(d: Date): void {
  d.setHours(12, 0, 0, 0)
  while (d.getDay() !== 6) {
    d.setDate(d.getDate() + 1)
  }
}

/** Upcoming Saturday dates only (starting from the next Saturday on or after `from`). */
export function getNextSaturdays(count: number, from: Date = new Date()): string[] {
  const d = new Date(from)
  moveToNextSaturday(d)
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    out.push(toISODateLocal(d))
    d.setDate(d.getDate() + 7)
  }
  return out
}

export function shortSaturdayLabel(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
