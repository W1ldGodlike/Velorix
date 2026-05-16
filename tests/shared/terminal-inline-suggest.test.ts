import { describe, expect, it } from 'vitest'

import type { TerminalCommandHintEntry } from '../../src/shared/terminal-contract'
import {
  TERMINAL_APPLY_INLINE_PICK_CASES,
  TERMINAL_FILTER_SUGGESTIONS_CASES,
  TERMINAL_STEP_SUGGEST_INDEX_CASES
} from '../fixtures/terminal-inline-suggest-cases'
import {
  applyTerminalInlinePick,
  DEFAULT_TERMINAL_INLINE_SUGGEST_MAX,
  filterTerminalInlineSuggestions,
  normalizeTerminalHintToken,
  stepTerminalSuggestIndex
} from '../../src/shared/terminal-inline-suggest'

const SAMPLE: TerminalCommandHintEntry[] = [
  { tool: 'ffmpeg', token: '-i', summary: 'input' },
  { tool: 'ffmpeg', token: '-version', summary: 'ver' },
  { tool: 'ffprobe', token: '-show_format', summary: 'fmt' },
  { tool: 'yt-dlp', token: '· -F', summary: 'formats', fullLine: 'yt-dlp -F ' },
  { tool: 'yt-dlp', token: '-J', summary: 'json', fullLine: 'yt-dlp -J ' }
]

describe('normalizeTerminalHintToken', () => {
  it('strips leading bullet marker', () => {
    expect(normalizeTerminalHintToken('· -F')).toBe('-F')
  })
})

describe('filterTerminalInlineSuggestions', () => {
  it('uses DEFAULT_TERMINAL_INLINE_SUGGEST_MAX when max omitted', () => {
    const many: TerminalCommandHintEntry[] = Array.from({ length: 40 }, (_, i) => ({
      tool: 'ffmpeg',
      token: `-x${i}`,
      summary: ''
    }))
    const r = filterTerminalInlineSuggestions({ line: 'ffmpeg ', hints: many })
    expect(r.length).toBe(DEFAULT_TERMINAL_INLINE_SUGGEST_MAX)
  })

  it.each(TERMINAL_FILTER_SUGGESTIONS_CASES)('$label', ({ line, max, assert }) => {
    const opts = max === undefined ? { line, hints: SAMPLE } : { line, hints: SAMPLE, max }
    assert(filterTerminalInlineSuggestions(opts))
  })

  it('deduplicates decorated and plain tokens with same fullLine', () => {
    const duplicates: TerminalCommandHintEntry[] = [
      { tool: 'yt-dlp', token: '· -F', summary: 'decorated', fullLine: 'yt-dlp -F ' },
      { tool: 'yt-dlp', token: '-F', summary: 'plain', fullLine: 'yt-dlp -F ' }
    ]
    const r = filterTerminalInlineSuggestions({ line: 'yt-dlp -', hints: duplicates, max: 20 })
    expect(r).toHaveLength(1)
    expect(r[0]?.fullLine).toBe('yt-dlp -F ')
  })

  it('keeps distinct fullLine variants even with same token', () => {
    const variants: TerminalCommandHintEntry[] = [
      { tool: 'yt-dlp', token: '-F', summary: 'formats', fullLine: 'yt-dlp -F ' },
      { tool: 'yt-dlp', token: '-F', summary: 'formats+url', fullLine: 'yt-dlp -F -- ' }
    ]
    const r = filterTerminalInlineSuggestions({ line: 'yt-dlp -', hints: variants, max: 20 })
    expect(r).toHaveLength(2)
  })
})

describe('stepTerminalSuggestIndex', () => {
  it.each(TERMINAL_STEP_SUGGEST_INDEX_CASES)(
    'stepTerminalSuggestIndex($index, $length, $direction)',
    ({ index, length, direction, pageSize, expected }) => {
      if (pageSize === undefined) {
        expect(stepTerminalSuggestIndex(index, length, direction)).toBe(expected)
      } else {
        expect(stepTerminalSuggestIndex(index, length, direction, pageSize)).toBe(expected)
      }
    }
  )
})

describe('applyTerminalInlinePick', () => {
  it.each(TERMINAL_APPLY_INLINE_PICK_CASES)('$label', ({ line, hint, expected }) => {
    expect(applyTerminalInlinePick({ line, hint })).toBe(expected)
  })
})
