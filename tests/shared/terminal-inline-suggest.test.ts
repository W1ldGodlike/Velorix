import { describe, expect, it } from 'vitest'

import type { TerminalCommandHintEntry } from '../../src/shared/terminal-contract'
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

  it('returns [] for empty / whitespace line', () => {
    expect(filterTerminalInlineSuggestions({ line: '', hints: SAMPLE })).toEqual([])
    expect(filterTerminalInlineSuggestions({ line: '  ', hints: SAMPLE })).toEqual([])
  })

  it('matches tool prefix (>=2 chars)', () => {
    const r = filterTerminalInlineSuggestions({ line: 'ff', hints: SAMPLE, max: 20 })
    expect(r.some((h) => h.tool === 'ffmpeg')).toBe(true)
    expect(r.some((h) => h.tool === 'ffprobe')).toBe(true)
  })

  it('exact tool without trailing space lists tool hints', () => {
    const r = filterTerminalInlineSuggestions({ line: 'ffmpeg', hints: SAMPLE, max: 20 })
    expect(r.every((h) => h.tool === 'ffmpeg')).toBe(true)
    expect(r.length).toBeGreaterThan(0)
  })

  it('trailing space after tool lists hints for that tool', () => {
    const r = filterTerminalInlineSuggestions({ line: 'ffmpeg ', hints: SAMPLE, max: 20 })
    expect(r.every((h) => h.tool === 'ffmpeg')).toBe(true)
  })

  it('matches last argv token within tool', () => {
    const r = filterTerminalInlineSuggestions({ line: 'ffmpeg -ver', hints: SAMPLE, max: 20 })
    expect(r.some((h) => h.token === '-version')).toBe(true)
  })

  it('matches fullLine prefix for scenarios', () => {
    const r = filterTerminalInlineSuggestions({ line: 'yt-dlp -', hints: SAMPLE, max: 20 })
    expect(r.some((h) => h.fullLine?.startsWith('yt-dlp -F'))).toBe(true)
  })
})

describe('stepTerminalSuggestIndex', () => {
  it('clamps stale index before stepping up', () => {
    expect(stepTerminalSuggestIndex(99, 3, 'up')).toBe(1)
  })

  it('clamps stale index before stepping down', () => {
    expect(stepTerminalSuggestIndex(99, 5, 'down')).toBe(4)
  })

  it('home/end with stale index', () => {
    expect(stepTerminalSuggestIndex(50, 4, 'home')).toBe(0)
    expect(stepTerminalSuggestIndex(50, 4, 'end')).toBe(3)
  })

  it('empty list yields 0', () => {
    expect(stepTerminalSuggestIndex(3, 0, 'down')).toBe(0)
  })
})

describe('applyTerminalInlinePick', () => {
  it('uses fullLine when set', () => {
    const h = SAMPLE.find((x) => x.fullLine) as TerminalCommandHintEntry
    expect(applyTerminalInlinePick({ line: 'yt-dlp ', hint: h })).toBe('yt-dlp -F ')
  })

  it('replaces last token and appends trailing space', () => {
    expect(
      applyTerminalInlinePick({
        line: 'ffmpeg -ver',
        hint: { tool: 'ffmpeg', token: '-version', summary: '' }
      })
    ).toBe('ffmpeg -version ')
  })

  it('appends token after tool with trailing space in line', () => {
    expect(
      applyTerminalInlinePick({
        line: 'ffmpeg ',
        hint: { tool: 'ffmpeg', token: '-i', summary: '' }
      })
    ).toBe('ffmpeg -i ')
  })

  it('appends flag after lone tool token', () => {
    expect(
      applyTerminalInlinePick({
        line: 'ffmpeg',
        hint: { tool: 'ffmpeg', token: '-version', summary: '' }
      })
    ).toBe('ffmpeg -version ')
  })
})
