import { expect } from 'vitest'

import {
  TERMINAL_CURRENT_FILE_PLACEHOLDER,
  TERMINAL_SCENARIO_HINTS_DOWNLOADS,
  TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA
} from '../../src/shared/terminal-contract'
import type { TerminalPreviewLinePredicate } from './terminal-preview-line-predicate-cases'

export function downloadsScenarioFullLines(): string[] {
  return TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
}

export function expectDownloadsFullLinesContain(expected: readonly string[]): void {
  const lines = downloadsScenarioFullLines()
  for (const line of expected) {
    expect(lines, line).toContain(line)
  }
}

export function previewScenarioFullLines(): string[] {
  return TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
}

export function expectPreviewLineSubstring(substring: string): void {
  const lines = previewScenarioFullLines()
  expect(
    lines.some((l) => l.includes(substring)),
    substring
  ).toBe(true)
}

export function expectPreviewLinePredicate(predicate: TerminalPreviewLinePredicate): void {
  const lines = previewScenarioFullLines()
  const excludes = predicate.excludes ?? []
  expect(
    lines.some((l) => {
      if (predicate.needPlaceholder && !l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)) {
        return false
      }
      if (!predicate.includes.every((s) => l.includes(s))) {
        return false
      }
      return !excludes.some((s) => l.includes(s))
    }),
    predicate.label
  ).toBe(true)
}
