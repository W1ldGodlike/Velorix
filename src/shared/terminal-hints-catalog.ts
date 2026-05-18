/**
 * §8 — фильтрация и лимиты панели полного каталога подсказок (JSON + сценарии).
 */

import type { TerminalCommandHintEntry, TerminalToolId } from './terminal-contract'
import { terminalHintExamplesForSearch } from './terminal-hint-json-display'

/** Максимум строк в панели при активном поиске или фильтре по инструменту. */
export const TERMINAL_HINT_CATALOG_PANEL_MAX = 240

/** Максимум строк без фильтра (первые по сортировке workspace). */
export const TERMINAL_HINT_CATALOG_PANEL_IDLE_MAX = 48

export type TerminalHintToolFilter = 'all' | 'scenarios' | TerminalToolId

export function isTerminalScenarioHint(hint: TerminalCommandHintEntry): boolean {
  return hint.fullLine !== undefined && hint.fullLine.trim().length > 0
}

export function hintMatchesTerminalCatalogFilter(
  hint: TerminalCommandHintEntry,
  query: string,
  toolFilter: TerminalHintToolFilter
): boolean {
  if (toolFilter === 'scenarios') {
    if (!isTerminalScenarioHint(hint)) {
      return false
    }
  } else if (toolFilter !== 'all' && hint.tool !== toolFilter) {
    return false
  }
  const q = query.trim().toLowerCase()
  if (q.length === 0) {
    return true
  }
  return (
    hint.tool.toLowerCase().includes(q) ||
    hint.token.toLowerCase().includes(q) ||
    hint.summary.toLowerCase().includes(q) ||
    terminalHintExamplesForSearch(hint).toLowerCase().includes(q) ||
    (hint.docUrl !== undefined && hint.docUrl.toLowerCase().includes(q)) ||
    (hint.fullLine !== undefined && hint.fullLine.toLowerCase().includes(q))
  )
}

export function filterTerminalHintCatalog(
  hints: readonly TerminalCommandHintEntry[],
  query: string,
  toolFilter: TerminalHintToolFilter
): TerminalCommandHintEntry[] {
  return hints.filter((h) => hintMatchesTerminalCatalogFilter(h, query, toolFilter))
}

export function capTerminalHintCatalogVisible(
  filtered: readonly TerminalCommandHintEntry[],
  query: string,
  toolFilter: TerminalHintToolFilter
): { visible: TerminalCommandHintEntry[]; total: number; capped: boolean } {
  const total = filtered.length
  const filterActive = query.trim().length > 0 || toolFilter !== 'all'
  const max = filterActive ? TERMINAL_HINT_CATALOG_PANEL_MAX : TERMINAL_HINT_CATALOG_PANEL_IDLE_MAX
  const visible = filtered.slice(0, max)
  return { visible, total, capped: total > visible.length }
}
