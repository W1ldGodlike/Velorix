import { describe, expect, it } from 'vitest'

import {
  DOWNLOADS_HISTORY_COMPACT_VISIBLE_COUNT,
  resolveDownloadsHistoryVisibleEntries
} from '../../src/renderer/src/components/downloads/downloads-history-display'

describe('downloads-history-display', () => {
  it('compact mode limits visible cards', () => {
    const entries = Array.from({ length: 12 }, (_, i) => i)
    expect(resolveDownloadsHistoryVisibleEntries(entries, 'compact')).toHaveLength(
      DOWNLOADS_HISTORY_COMPACT_VISIBLE_COUNT
    )
    expect(resolveDownloadsHistoryVisibleEntries(entries, 'full')).toHaveLength(12)
  })
})
