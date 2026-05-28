import { describe, expect, it } from 'vitest'

import {
  isDownloadsRowActive,
  isDownloadsRowComplete,
  isDownloadsRowError,
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

describe('isDownloadsRowComplete', () => {
  it('detects finished statuses', () => {
    expect(isDownloadsRowComplete('Готово')).toBe(true)
    expect(isDownloadsRowComplete('Downloading')).toBe(false)
  })
})

describe('isDownloadsRowError', () => {
  it('detects error statuses', () => {
    expect(isDownloadsRowError('Ошибка сети')).toBe(true)
    expect(isDownloadsRowError('Загрузка')).toBe(false)
  })
})

describe('isDownloadsRowActive', () => {
  it('detects in-progress rows', () => {
    expect(isDownloadsRowActive('Загрузка 12%')).toBe(true)
    expect(isDownloadsRowActive('Готово')).toBe(false)
    expect(isDownloadsRowActive('Ошибка')).toBe(false)
  })
})

describe('parseDownloadsProgressPercent', () => {
  it('extracts percent', () => {
    expect(parseDownloadsProgressPercent('45%')).toBe(45)
    expect(parseDownloadsProgressPercent('—')).toBe(0)
  })
})
