import { expect } from 'vitest'

import type { TerminalCommandHintEntry } from '../../src/shared/terminal-contract'

type SuggestStep = 'up' | 'down' | 'home' | 'end' | 'pageUp' | 'pageDown'

export const TERMINAL_STEP_SUGGEST_INDEX_CASES = [
  { index: 99, length: 3, direction: 'up' as SuggestStep, pageSize: undefined as number | undefined, expected: 1 },
  { index: 99, length: 5, direction: 'down' as SuggestStep, pageSize: undefined, expected: 4 },
  { index: 50, length: 4, direction: 'home' as SuggestStep, pageSize: undefined, expected: 0 },
  { index: 50, length: 4, direction: 'end' as SuggestStep, pageSize: undefined, expected: 3 },
  { index: 3, length: 0, direction: 'down' as SuggestStep, pageSize: undefined, expected: 0 },
  { index: 0, length: 12, direction: 'pageDown' as SuggestStep, pageSize: 5, expected: 5 },
  { index: 10, length: 12, direction: 'pageDown' as SuggestStep, pageSize: 5, expected: 11 },
  { index: 7, length: 12, direction: 'pageUp' as SuggestStep, pageSize: 5, expected: 2 },
  { index: 2, length: 12, direction: 'pageUp' as SuggestStep, pageSize: 5, expected: 0 },
  { index: 0, length: 12, direction: 'pageDown' as SuggestStep, pageSize: undefined, expected: 5 }
] as const

export const TERMINAL_APPLY_INLINE_PICK_CASES: ReadonlyArray<{
  label: string
  line: string
  hint: TerminalCommandHintEntry
  expected: string
}> = [
  {
    label: 'fullLine',
    line: 'yt-dlp ',
    hint: { tool: 'yt-dlp', token: '· -F', summary: 'formats', fullLine: 'yt-dlp -F ' },
    expected: 'yt-dlp -F '
  },
  {
    label: 'replace last token',
    line: 'ffmpeg -ver',
    hint: { tool: 'ffmpeg', token: '-version', summary: '' },
    expected: 'ffmpeg -version '
  },
  {
    label: 'append after tool with space',
    line: 'ffmpeg ',
    hint: { tool: 'ffmpeg', token: '-i', summary: '' },
    expected: 'ffmpeg -i '
  },
  {
    label: 'append after lone tool',
    line: 'ffmpeg',
    hint: { tool: 'ffmpeg', token: '-version', summary: '' },
    expected: 'ffmpeg -version '
  }
]

export const TERMINAL_FILTER_SUGGESTIONS_CASES: ReadonlyArray<{
  label: string
  line: string
  max?: number
  assert: (rows: TerminalCommandHintEntry[]) => void
}> = [
  {
    label: 'empty line',
    line: '',
    assert: (r) => expect(r).toEqual([])
  },
  {
    label: 'whitespace line',
    line: '  ',
    assert: (r) => expect(r).toEqual([])
  },
  {
    label: 'tool prefix ff',
    line: 'ff',
    max: 20,
    assert: (r) => {
      expect(r.some((h) => h.tool === 'ffmpeg')).toBe(true)
      expect(r.some((h) => h.tool === 'ffprobe')).toBe(true)
    }
  },
  {
    label: 'exact tool ffmpeg',
    line: 'ffmpeg',
    max: 20,
    assert: (r) => {
      expect(r.every((h) => h.tool === 'ffmpeg')).toBe(true)
      expect(r.length).toBeGreaterThan(0)
    }
  },
  {
    label: 'ffmpeg with trailing space',
    line: 'ffmpeg ',
    max: 20,
    assert: (r) => expect(r.every((h) => h.tool === 'ffmpeg')).toBe(true)
  },
  {
    label: 'last argv token',
    line: 'ffmpeg -ver',
    max: 20,
    assert: (r) => expect(r.some((h) => h.token === '-version')).toBe(true)
  },
  {
    label: 'fullLine prefix yt-dlp',
    line: 'yt-dlp -',
    max: 20,
    assert: (r) => expect(r.some((h) => h.fullLine?.startsWith('yt-dlp -F'))).toBe(true)
  }
]
