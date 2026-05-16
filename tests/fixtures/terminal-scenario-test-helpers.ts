import { expect } from 'vitest'

import { TERMINAL_SCENARIO_HINTS_DOWNLOADS } from '../../src/shared/terminal-contract'

export function downloadsScenarioFullLines(): string[] {
  return TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
}

export function expectDownloadsFullLinesContain(expected: readonly string[]): void {
  const lines = downloadsScenarioFullLines()
  for (const line of expected) {
    expect(lines, line).toContain(line)
  }
}
