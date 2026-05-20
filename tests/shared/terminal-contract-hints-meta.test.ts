import { describe, expect, it } from 'vitest'

import {
  TERMINAL_CONTRACT_HINTS_GUARD_NPM_SCRIPTS,
  TERMINAL_CONTRACT_HINTS_GUARD_QUIET_STEP_LABELS,
  TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_SHARD_TOTAL_PART_COUNT,
  formatTerminalContractHintsDownloadsShardBasename,
  formatTerminalContractHintsDiagnosticLine,
  formatTerminalContractHintsPreviewMediaShardBasename,
  formatTerminalContractHintsSupportZipLines
} from '../../src/shared/terminal-contract-hints-meta'
import { TERMINAL_SCENARIO_HINTS_DOWNLOADS } from '../../src/shared/terminal-contract-hints-downloads'
import { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA } from '../../src/shared/terminal-contract-hints-preview-media'

describe('terminal-contract-hints-meta §8', () => {
  it('shard basenames and totals', () => {
    expect(formatTerminalContractHintsDownloadsShardBasename(1)).toBe(
      'terminal-contract-hints-downloads-01.ts'
    )
    expect(formatTerminalContractHintsPreviewMediaShardBasename(1)).toBe(
      'terminal-contract-hints-preview-media-01.ts'
    )
    expect(TERMINAL_CONTRACT_HINTS_SHARD_TOTAL_PART_COUNT).toBeGreaterThan(0)
    expect(TERMINAL_SCENARIO_HINTS_DOWNLOADS.length).toBeGreaterThan(0)
    expect(TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.length).toBeGreaterThan(0)
  })

  it('guard registries list quiet steps and npm scripts', () => {
    expect(TERMINAL_CONTRACT_HINTS_GUARD_QUIET_STEP_LABELS.length).toBe(4)
    expect(TERMINAL_CONTRACT_HINTS_GUARD_NPM_SCRIPTS).toContain(
      TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT
    )
    expect(formatTerminalContractHintsDiagnosticLine()).toContain(
      'check:terminal-contract-hints-shards'
    )
  })

  it('formatTerminalContractHintsSupportZipLines cites guards', () => {
    const lines = formatTerminalContractHintsSupportZipLines()
    expect(lines.some((l) => l.includes('check:terminal-contract-hints-shards'))).toBe(true)
    expect(lines.some((l) => l.includes('check:support-bundle-terminal-hints'))).toBe(true)
  })
})
