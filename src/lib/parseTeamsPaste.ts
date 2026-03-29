/**
 * One team per line: "Player A & Player B" or "Player A and Player B".
 * Extra "&" segments are joined into player B.
 */
export function parseTeamLine(line: string): { playerA: string; playerB: string } | null {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return null

  let a: string
  let b: string

  if (trimmed.includes('&')) {
    const parts = trimmed.split(/\s*&\s*/)
    if (parts.length < 2) return null
    a = parts[0].trim()
    b = parts.slice(1).join(' & ').trim()
  } else if (/\s+and\s+/i.test(trimmed)) {
    const parts = trimmed.split(/\s+and\s+/i)
    if (parts.length < 2) return null
    a = parts[0].trim()
    b = parts.slice(1).join(' and ').trim()
  } else {
    return null
  }

  if (!a || !b) return null
  return { playerA: a, playerB: b }
}

export function parseTeamsPaste(text: string): { playerA: string; playerB: string }[] {
  const lines = text.split(/\r?\n/)
  const out: { playerA: string; playerB: string }[] = []
  for (const line of lines) {
    const p = parseTeamLine(line)
    if (p) out.push(p)
  }
  return out
}

export function formatTeamLabel(p: { playerA: string; playerB: string }): string {
  return `${p.playerA.trim()} & ${p.playerB.trim()}`
}
