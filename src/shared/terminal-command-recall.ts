/**
 * §8 — recall предыдущих команд в поле argv (ArrowUp/Down), когда IntelliSense закрыт.
 */

export type TerminalRecallState = {
  index: number | null
  draft: string | null
}

/** Уникальные непустые строки, от новых к старым (порядок `terminalHistory`). */
export function listTerminalRecallLines(historyLines: readonly string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of historyLines) {
    const line = raw.trim()
    if (line.length > 0 && !seen.has(line)) {
      seen.add(line)
      out.push(line)
    }
  }
  return out
}

export function applyTerminalRecallStep(
  state: TerminalRecallState,
  currentInput: string,
  recallLines: readonly string[],
  direction: 'up' | 'down'
): { next: TerminalRecallState; line: string } {
  if (recallLines.length === 0) {
    return { next: state, line: currentInput }
  }
  if (direction === 'up') {
    if (state.index === null) {
      return {
        next: { index: 0, draft: currentInput },
        line: recallLines[0]!
      }
    }
    const nextIdx = Math.min(state.index + 1, recallLines.length - 1)
    return {
      next: { index: nextIdx, draft: state.draft },
      line: recallLines[nextIdx]!
    }
  }
  if (state.index === null) {
    return { next: state, line: currentInput }
  }
  if (state.index === 0) {
    return {
      next: { index: null, draft: null },
      line: state.draft ?? currentInput
    }
  }
  const nextIdx = state.index - 1
  return {
    next: { index: nextIdx, draft: state.draft },
    line: recallLines[nextIdx]!
  }
}
