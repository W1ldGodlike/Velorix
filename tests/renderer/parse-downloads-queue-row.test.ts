import { describe, expect, it } from 'vitest'

import {
  parseDownloadsProgressPercent,
  parseDownloadsQueueRow,
  parseDownloadsQueueSnapshot
} from '../../src/renderer/src/lib/parse-downloads-queue-row'

describe('parseDownloadsQueueRow', () => {
  it('parses valid row', () => {
    const row = parseDownloadsQueueRow({
      id: 1,
      url: 'https://example.com/v',
      shortLabel: 'example.com/v',
      progress: '45%',
      status: 'Загрузка'
    })
    expect(row?.id).toBe(1)
    expect(row?.progress).toBe('45%')
  })

  it('parses snapshot array', () => {
    const rows = parseDownloadsQueueSnapshot([
      { id: 2, url: 'https://a.test', shortLabel: 'a', progress: '—', status: 'Ожидание' },
      null
    ])
    expect(rows).toHaveLength(1)
  })
})

describe('parseDownloadsProgressPercent', () => {
  it('extracts percent', () => {
    expect(parseDownloadsProgressPercent('45%')).toBe(45)
    expect(parseDownloadsProgressPercent('—')).toBe(0)
  })
})
