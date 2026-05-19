import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT,
  TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT,
  TERMINAL_CONTRACT_HINTS_GUARD_NPM_SCRIPTS,
  TERMINAL_CONTRACT_HINTS_GUARD_QUIET_STEP_LABELS,
  TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_HELP_REQUIRED_SNIPPETS,
  TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT,
  TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT,
  TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT,
  TERMINAL_CONTRACT_HINTS_SHARD_TOTAL_PART_COUNT,
  TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT,
  TERMINAL_CONTRACT_HINTS_TOOLS_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_REQUIRED_SNIPPETS,
  TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_REQUIRED_SNIPPETS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_DOWNLOADS_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_PACKAGED_SMOKE_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_FAQ_TROUBLESHOOTING_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_OWNER_MANUAL_SMOKE_HELP_PATHS,
  TERMINAL_CONTRACT_HINTS_BIN_README_PATH,
  TERMINAL_CONTRACT_HINTS_TOOLS_HELP_REQUIRED_SNIPPETS,
  formatTerminalContractHintsAboutSupportZipSectionsHint,
  formatTerminalContractHintsBinReadmeGuardsLine,
  formatTerminalContractHintsDiagnosticLine,
  formatTerminalContractHintsAboutSupportZipTerminalHintsBullet,
  formatTerminalContractHintsFfmpegHelpSupportZipLine,
  formatTerminalContractHintsToolsHelpPackagedSmokeLine,
  formatTerminalContractHintsLoggingHelpDevGuardsLine,
  formatTerminalContractHintsDownloadsShardBasename,
  formatTerminalContractHintsPreviewMediaShardBasename,
  formatTerminalContractHintsSettingsHelpClause,
  formatTerminalContractHintsShardCountEnSnippet,
  formatTerminalContractHintsSupportZipLines
} from '../../src/shared/terminal-contract-hints-meta'
import { TERMINAL_SCENARIO_HINTS_DOWNLOADS } from '../../src/shared/terminal-contract-hints-downloads'
import { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA } from '../../src/shared/terminal-contract-hints-preview-media'

describe('terminal-contract-hints-meta §8', () => {
  it('shard basenames and totals', () => {
    expect(formatTerminalContractHintsDownloadsShardBasename(1)).toBe(
      'terminal-contract-hints-downloads-01.ts'
    )
    expect(formatTerminalContractHintsPreviewMediaShardBasename(15)).toBe(
      'terminal-contract-hints-preview-media-15.ts'
    )
    expect(TERMINAL_CONTRACT_HINTS_SHARD_TOTAL_PART_COUNT).toBe(
      TERMINAL_CONTRACT_HINTS_DOWNLOADS_PART_COUNT +
        TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_PART_COUNT
    )
    expect(TERMINAL_CONTRACT_HINTS_HELP_DOCS_FILE_COUNT).toBe(24)
    expect(TERMINAL_CONTRACT_HINTS_WORKFLOW_HELP_CROSSLINKS_TAIL_HELP_PATHS).toHaveLength(42)
    expect(formatTerminalContractHintsShardCountEnSnippet()).toContain('20 downloads')
    expect(formatTerminalContractHintsDiagnosticLine()).toContain(
      TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT
    )
  })

  it('hint count snapshots match merged arrays', () => {
    expect(TERMINAL_SCENARIO_HINTS_DOWNLOADS.length).toBe(
      TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT
    )
    expect(TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.length).toBe(
      TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT
    )
  })

  it('guard registries list quiet steps and npm scripts', () => {
    expect(TERMINAL_CONTRACT_HINTS_GUARD_QUIET_STEP_LABELS.length).toBe(7)
    expect(TERMINAL_CONTRACT_HINTS_GUARD_NPM_SCRIPTS).toContain(
      TERMINAL_CONTRACT_HINTS_SHARDS_GUARD_NPM_SCRIPT
    )
    expect(formatTerminalContractHintsBinReadmeGuardsLine()).toContain(
      TERMINAL_CONTRACT_HINTS_HELP_DOCS_GUARD_NPM_SCRIPT
    )
  })

  it('Help ffmpeg-terminal-hints articles cite meta + guard', () => {
    for (const rel of TERMINAL_CONTRACT_HINTS_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const text = readFileSync(rel, 'utf8')
      for (const snippet of TERMINAL_CONTRACT_HINTS_HELP_REQUIRED_SNIPPETS) {
        expect(text, `${rel} missing ${snippet}`).toContain(snippet)
      }
      expect(text).toContain(formatTerminalContractHintsFfmpegHelpSupportZipLine(locale))
    }
  })

  it('formatTerminalContractHintsSupportZipLines cites guards', () => {
    const lines = formatTerminalContractHintsSupportZipLines()
    expect(lines.some((l) => l.includes('terminal-contract-hints-meta'))).toBe(true)
    expect(lines.some((l) => l.includes('check:terminal-contract-hints-shards'))).toBe(true)
    expect(lines.some((l) => l.includes('check:support-bundle-terminal-hints'))).toBe(true)
    expect(lines.some((l) => l.includes('appSettingsTerminalHintsGuardHint'))).toBe(true)
  })

  it('formatTerminalContractHintsAboutSupportZipTerminalHintsBullet matches about Help', () => {
    for (const rel of TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(formatTerminalContractHintsAboutSupportZipTerminalHintsBullet(locale))
    }
  })

  it('formatTerminalContractHintsLoggingHelpDevGuardsLine matches logging Help', () => {
    for (const rel of TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(formatTerminalContractHintsLoggingHelpDevGuardsLine(locale))
    }
  })

  it('formatTerminalContractHintsSettingsHelpClause matches locales', () => {
    const ru = readFileSync('locales/ru/settings.json', 'utf8')
    const en = readFileSync('locales/en/settings.json', 'utf8')
    expect(ru).toContain(formatTerminalContractHintsSettingsHelpClause('ru'))
    expect(en).toContain(formatTerminalContractHintsSettingsHelpClause('en'))
  })

  it('formatTerminalContractHintsAboutSupportZipSectionsHint matches about.json', () => {
    const ruAbout = JSON.parse(readFileSync('locales/ru/about.json', 'utf8')) as Record<
      string,
      string
    >
    const enAbout = JSON.parse(readFileSync('locales/en/about.json', 'utf8')) as Record<
      string,
      string
    >
    expect(ruAbout['aboutSupportZipDiagnosticsSectionsHint']).toBe(
      formatTerminalContractHintsAboutSupportZipSectionsHint('ru')
    )
    expect(enAbout['aboutSupportZipDiagnosticsSectionsHint']).toBe(
      formatTerminalContractHintsAboutSupportZipSectionsHint('en')
    )
  })

  it('Help workflow hubs cite Support ZIP terminalHints', () => {
    for (const rel of TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_PATHS) {
      const text = readFileSync(rel, 'utf8')
      for (const snippet of TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS) {
        expect(text, `${rel} missing ${snippet}`).toContain(snippet)
      }
    }
    for (const rel of TERMINAL_CONTRACT_HINTS_WORKFLOW_DOWNLOADS_HELP_PATHS) {
      const text = readFileSync(rel, 'utf8')
      for (const snippet of TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS) {
        expect(text, `${rel} missing ${snippet}`).toContain(snippet)
      }
    }
    for (const rel of TERMINAL_CONTRACT_HINTS_PACKAGED_SMOKE_HELP_PATHS) {
      const text = readFileSync(rel, 'utf8')
      for (const snippet of TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS) {
        expect(text, `${rel} missing ${snippet}`).toContain(snippet)
      }
    }
    for (const rel of TERMINAL_CONTRACT_HINTS_FAQ_TROUBLESHOOTING_HELP_PATHS) {
      const text = readFileSync(rel, 'utf8')
      for (const snippet of TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS) {
        expect(text, `${rel} missing ${snippet}`).toContain(snippet)
      }
    }
    for (const rel of TERMINAL_CONTRACT_HINTS_OWNER_MANUAL_SMOKE_HELP_PATHS) {
      const text = readFileSync(rel, 'utf8')
      for (const snippet of TERMINAL_CONTRACT_HINTS_WORKFLOW_HUB_HELP_REQUIRED_SNIPPETS) {
        expect(text, `${rel} missing ${snippet}`).toContain(snippet)
      }
    }
  })

  it('Help tools-terminal-inspector hub cites meta and Support ZIP terminalHints', () => {
    for (const rel of TERMINAL_CONTRACT_HINTS_TOOLS_HELP_PATHS) {
      const locale = rel.includes('/en/') ? 'en' : 'ru'
      const text = readFileSync(rel, 'utf8')
      for (const snippet of TERMINAL_CONTRACT_HINTS_TOOLS_HELP_REQUIRED_SNIPPETS) {
        expect(text, `${rel} missing ${snippet}`).toContain(snippet)
      }
      expect(text).toContain(formatTerminalContractHintsToolsHelpPackagedSmokeLine(locale))
    }
  })

  it('bin/README and §18 Help cite terminal guards', () => {
    const binReadme = readFileSync(TERMINAL_CONTRACT_HINTS_BIN_README_PATH, 'utf8')
    expect(binReadme).toContain(formatTerminalContractHintsBinReadmeGuardsLine())
    for (const rel of TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_PATHS) {
      const text = readFileSync(rel, 'utf8')
      for (const snippet of TERMINAL_CONTRACT_HINTS_ABOUT_SUPPORT_HELP_REQUIRED_SNIPPETS) {
        expect(text, `${rel} missing ${snippet}`).toContain(snippet)
      }
    }
    for (const rel of TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_PATHS) {
      const text = readFileSync(rel, 'utf8')
      for (const snippet of TERMINAL_CONTRACT_HINTS_LOGGING_DIAGNOSTICS_HELP_REQUIRED_SNIPPETS) {
        expect(text, `${rel} missing ${snippet}`).toContain(snippet)
      }
    }
  })
})
