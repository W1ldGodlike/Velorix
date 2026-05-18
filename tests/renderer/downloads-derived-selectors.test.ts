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

/** Mirrors `selectVisibleDownloadsHistory` when outcome filter is not `all`. */
describe('downloads history filter (useDownloadsDerivedState useMemo)', () => {
  it('filter() yields new array reference each call', () => {
    const history: { outcome: 'success' | 'failed' }[] = []
    const outcomeFilter = 'success' as const
    const a = history.filter((e) => e.outcome === outcomeFilter)
    const b = history.filter((e) => e.outcome === outcomeFilter)
    expect(a).not.toBe(b)
    expect(a).toEqual(b)
  })
})
