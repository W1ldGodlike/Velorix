import { describe, expect, it } from 'vitest'

import { groupYtdlpCommandHintsByCategory } from '../../src/shared/ytdlp-command-hints-group'

describe('ytdlp command hints grouping (renderer useMemo)', () => {
  it('returns new array reference on each call — Zustand selectors must not use this bare', () => {
    const hints = [{ token: '-f', summary: 'Format', category: 'General' }]
    const a = groupYtdlpCommandHintsByCategory(hints, '', 'ru')
    const b = groupYtdlpCommandHintsByCategory(hints, '', 'ru')
    expect(a).not.toBe(b)
    expect(a).toEqual(b)
  })
})
