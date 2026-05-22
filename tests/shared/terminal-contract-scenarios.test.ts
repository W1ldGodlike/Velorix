import { describe, expect, it } from 'vitest'

import {
  TERMINAL_DOWNLOADS_EXTRA_SCENARIO_LINES,
  TERMINAL_DOWNLOADS_PRINT_TEMPLATE_LINES
} from '../fixtures/terminal-downloads-full-line-expectations'
import { TERMINAL_DOWNLOADS_LINE_BATCHES } from '../fixtures/terminal-downloads-line-batches'
import { TERMINAL_PREVIEW_LINE_SUBSTRINGS } from '../fixtures/terminal-preview-line-substring-cases'
import { TERMINAL_PREVIEW_LINE_PREDICATES } from '../fixtures/terminal-preview-line-predicate-cases'
import {
  downloadsScenarioFullLines,
  expectDownloadsFullLinesContain,
  expectPreviewLinePredicate,
  expectPreviewLineSubstring
} from '../fixtures/terminal-scenario-test-helpers'
import {
  TERMINAL_CURRENT_FILE_PLACEHOLDER,
  TERMINAL_SCENARIO_HINTS_DOWNLOADS,
  TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA
} from '../../src/shared/terminal-contract'
import {
  TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT,
  TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT_FLOOR,
  TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT
} from '../../src/shared/terminal-contract-hints-meta'

/** Парсер вкладки «Терминал» не принимает кавычки в строке команды. */
function terminalLineAllowsQuotes(line: string): boolean {
  return !/["']/.test(line)
}

describe('TERMINAL_SCENARIO_HINTS_*', () => {
  it('downloads: без дублей fullLine и с базовым объёмом набора', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => (h.fullLine ?? '').trim())
    const nonEmpty = lines.filter((line) => line.length > 0)
    const unique = new Set(nonEmpty)
    expect(nonEmpty.length).toBe(TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT)
    expect(nonEmpty.length).toBeGreaterThanOrEqual(
      TERMINAL_CONTRACT_HINTS_DOWNLOADS_HINT_COUNT_FLOOR
    )
    expect(unique.size).toBe(nonEmpty.length)
  })

  it('preview: snapshot hint count', () => {
    expect(TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.length).toBe(
      TERMINAL_CONTRACT_HINTS_PREVIEW_MEDIA_HINT_COUNT
    )
  })

  it('downloads + preview: RU summary — нет «допишите URL»; при velorix-ytdlp есть глосс (поле …)', () => {
    for (const h of TERMINAL_SCENARIO_HINTS_DOWNLOADS) {
      expect(h.summary, h.token).not.toContain('допишите URL')
      if (h.summary.includes('velorix-ytdlp')) {
        expect(h.summary, h.token).toContain('(поле ')
      }
    }
    for (const h of TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA) {
      expect(h.summary, h.token).not.toContain('допишите URL')
      if (h.summary.includes('velorix-ytdlp')) {
        expect(h.summary, h.token).toContain('(поле ')
      }
    }
  })

  it('downloads: fullLine без кавычек и с префиксом yt-dlp', () => {
    for (const h of TERMINAL_SCENARIO_HINTS_DOWNLOADS) {
      expect(h.tool).toBe('yt-dlp')
      expect(h.fullLine, h.token).toBeTruthy()
      expect(terminalLineAllowsQuotes(h.fullLine!), h.token).toBe(true)
      expect(h.fullLine!.trimStart().startsWith('yt-dlp '), h.token).toBe(true)
      expect(h.fullLine).not.toContain(TERMINAL_CURRENT_FILE_PLACEHOLDER)
    }
  })

  it('preview: fullLine без кавычек, плейсхолдер ровно один раз', () => {
    for (const h of TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA) {
      expect(h.fullLine, h.token).toBeTruthy()
      expect(terminalLineAllowsQuotes(h.fullLine!), h.token).toBe(true)
      const n = h.fullLine!.split(TERMINAL_CURRENT_FILE_PLACEHOLDER).length - 1
      expect(n, h.token).toBe(1)
    }
  })

  it.each(TERMINAL_PREVIEW_LINE_SUBSTRINGS)(
    'preview: fullLine содержит фрагмент %s',
    (substring) => {
      expectPreviewLineSubstring(substring)
    }
  )

  it.each(TERMINAL_PREVIEW_LINE_PREDICATES)('preview: $label', (predicate) => {
    expectPreviewLinePredicate(predicate)
  })

  it.each(TERMINAL_DOWNLOADS_PRINT_TEMPLATE_LINES)(
    'downloads: fullLine содержит print-шаблон %s',
    (expected) => {
      expect(downloadsScenarioFullLines()).toContain(expected)
    }
  )

  it.each(TERMINAL_DOWNLOADS_EXTRA_SCENARIO_LINES)(
    'downloads: fullLine содержит доп. сценарий %s',
    (expected) => {
      expect(downloadsScenarioFullLines()).toContain(expected)
    }
  )

  it.each(TERMINAL_DOWNLOADS_LINE_BATCHES)('downloads batch: $label', ({ lines }) => {
    expectDownloadsFullLinesContain(lines)
  })
})
