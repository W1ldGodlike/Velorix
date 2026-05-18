import { describe, expect, it } from 'vitest'

import type { TerminalCommandHintEntry } from '../../src/shared/terminal-contract'
import {
  formatTerminalHintTooltip,
  primaryTerminalHintExample,
  terminalHintExamplesForSearch
} from '../../src/shared/terminal-hint-json-display'
import { hintMatchesTerminalCatalogFilter } from '../../src/shared/terminal-hints-catalog'

const HINT: TerminalCommandHintEntry = {
  token: '-i',
  summary: 'Входной файл',
  tool: 'ffmpeg',
  examples: ['ffmpeg -i in.mp4 out.mkv'],
  docUrl: 'https://ffmpeg.org/ffmpeg.html'
}

describe('terminal-hint-json-display', () => {
  it('primaryTerminalHintExample returns first example', () => {
    expect(primaryTerminalHintExample(HINT)).toBe('ffmpeg -i in.mp4 out.mkv')
    expect(primaryTerminalHintExample({ ...HINT, examples: [] })).toBeUndefined()
  })

  it('formatTerminalHintTooltip joins summary and example', () => {
    expect(formatTerminalHintTooltip(HINT)).toContain('Входной файл')
    expect(formatTerminalHintTooltip(HINT)).toContain('ffmpeg -i in.mp4')
  })

  it('catalog filter matches example text', () => {
    expect(hintMatchesTerminalCatalogFilter(HINT, 'in.mp4', 'all')).toBe(true)
    expect(hintMatchesTerminalCatalogFilter(HINT, 'ffmpeg.org', 'all')).toBe(true)
    expect(terminalHintExamplesForSearch(HINT)).toContain('ffmpeg -i')
  })
})
