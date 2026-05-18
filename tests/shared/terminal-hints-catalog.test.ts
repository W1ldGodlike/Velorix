import { describe, expect, it } from 'vitest'

import type { TerminalCommandHintEntry } from '../../src/shared/terminal-contract'
import {
  capTerminalHintCatalogVisible,
  filterTerminalHintCatalog,
  isTerminalScenarioHint,
  TERMINAL_HINT_CATALOG_PANEL_IDLE_MAX,
  TERMINAL_HINT_CATALOG_PANEL_MAX
} from '../../src/shared/terminal-hints-catalog'

const SAMPLE: TerminalCommandHintEntry[] = [
  { tool: 'ffmpeg', token: '-i', summary: 'input' },
  {
    tool: 'ffmpeg',
    token: '· smoke',
    summary: 'decode smoke',
    fullLine: 'ffmpeg -nostats -i __CURRENT_FILE__ -t 10 -f null -'
  },
  { tool: 'ffmpeg', token: '-c:v', summary: 'video codec' },
  { tool: 'ffprobe', token: '-show_format', summary: 'format' },
  { tool: 'yt-dlp', token: '-F', summary: 'formats' }
]

describe('terminal-hints-catalog', () => {
  it('filterTerminalHintCatalog by tool', () => {
    const r = filterTerminalHintCatalog(SAMPLE, '', 'ffprobe')
    expect(r).toHaveLength(1)
    expect(r[0]?.token).toBe('-show_format')
  })

  it('filterTerminalHintCatalog by scenarios chip', () => {
    const r = filterTerminalHintCatalog(SAMPLE, '', 'scenarios')
    expect(r).toHaveLength(1)
    expect(r[0]?.fullLine).toContain('__CURRENT_FILE__')
    expect(isTerminalScenarioHint(r[0]!)).toBe(true)
  })

  it('filterTerminalHintCatalog by text', () => {
    const r = filterTerminalHintCatalog(SAMPLE, 'codec', 'all')
    expect(r.some((h) => h.token === '-c:v')).toBe(true)
  })

  it('capTerminalHintCatalogVisible — idle cap', () => {
    const many = Array.from({ length: 80 }, (_, i) => ({
      tool: 'ffmpeg' as const,
      token: `-${i}`,
      summary: ''
    }))
    const { visible, total, capped } = capTerminalHintCatalogVisible(many, '', 'all')
    expect(total).toBe(80)
    expect(visible).toHaveLength(TERMINAL_HINT_CATALOG_PANEL_IDLE_MAX)
    expect(capped).toBe(true)
  })

  it('capTerminalHintCatalogVisible — active filter up to 240', () => {
    const many = Array.from({ length: 300 }, (_, i) => ({
      tool: 'ffmpeg' as const,
      token: `-${i}`,
      summary: ''
    }))
    const { visible, capped } = capTerminalHintCatalogVisible(many, '', 'ffmpeg')
    expect(visible).toHaveLength(TERMINAL_HINT_CATALOG_PANEL_MAX)
    expect(capped).toBe(true)
  })
})
