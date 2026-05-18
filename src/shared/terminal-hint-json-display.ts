import type { TerminalCommandHintEntry } from './terminal-contract'

export const TERMINAL_HINT_MAX_EXAMPLES = 2
export const TERMINAL_HINT_MAX_EXAMPLE_CHARS = 220
export const TERMINAL_HINT_MAX_DOC_URL_CHARS = 400

export function primaryTerminalHintExample(
  hint: TerminalCommandHintEntry
): string | undefined {
  const first = hint.examples?.[0]?.trim()
  return first !== undefined && first.length > 0 ? first : undefined
}

/** Подсказка при наведении: описание + первый пример из JSON. */
export function formatTerminalHintTooltip(hint: TerminalCommandHintEntry): string {
  const parts: string[] = []
  const summary = hint.summary.trim()
  if (summary.length > 0) {
    parts.push(summary)
  }
  const example = primaryTerminalHintExample(hint)
  if (example !== undefined) {
    parts.push(example)
  }
  return parts.join('\n').slice(0, 600)
}

export function terminalHintExamplesForSearch(hint: TerminalCommandHintEntry): string {
  return (hint.examples ?? []).join(' ')
}
