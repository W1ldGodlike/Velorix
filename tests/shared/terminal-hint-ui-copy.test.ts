import { describe, expect, it } from 'vitest'

import type { TerminalCommandHintEntry } from '../../src/shared/terminal-contract'
import {
  formatTerminalHintRowLabel,
  formatTerminalHintRowSummary,
  humanizeTerminalFfprobeStreamSpecifiersInUiCopy
} from '../../src/shared/terminal-hint-ui-copy'

describe('terminal-hint-ui-copy', () => {
  it('humanizes stream indices in Russian tokens and summaries', () => {
    expect(humanizeTerminalFfprobeStreamSpecifiersInUiCopy('· видео v:0 кратко', 'ru')).toBe(
      '· видео 1 кратко'
    )
    expect(
      humanizeTerminalFfprobeStreamSpecifiersInUiCopy('Первая видеодорожка (v:0): ширина', 'ru')
    ).toBe('Первая видеодорожка (видео 1): ширина')
    expect(
      humanizeTerminalFfprobeStreamSpecifiersInUiCopy('Вторая аудиодорожка (a:1): тег', 'ru')
    ).toBe('Вторая аудиодорожка (аудио 2): тег')
    expect(humanizeTerminalFfprobeStreamSpecifiersInUiCopy('-map 0:v:0 — первая', 'ru')).toBe(
      '-map видео 1 — первая'
    )
  })

  it('humanizes stream indices in English', () => {
    expect(humanizeTerminalFfprobeStreamSpecifiersInUiCopy('· video v:0 compact', 'en')).toBe(
      '· video 1 compact'
    )
    expect(humanizeTerminalFfprobeStreamSpecifiersInUiCopy('Second audio (a:1): tag', 'en')).toBe(
      'Second audio (audio 2): tag'
    )
  })

  it('formatTerminalHintRow* uses token not fullLine', () => {
    const hint: TerminalCommandHintEntry = {
      token: '· видео v:0 кратко',
      summary: 'Первая видеодорожка (v:0): ширина',
      tool: 'ffprobe',
      fullLine: 'ffprobe -select_streams v:0 file.mp4'
    }
    expect(formatTerminalHintRowLabel(hint, 'ru')).toBe('· видео 1 кратко')
    expect(formatTerminalHintRowSummary(hint, 'ru')).toBe('Первая видеодорожка (видео 1): ширина')
  })
})
