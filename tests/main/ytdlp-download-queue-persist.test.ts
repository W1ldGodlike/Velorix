import { afterEach, describe, expect, it } from 'vitest'

import {
  appendUrlsFromMultilineBlock,
  clearDownloadsQueue,
  getDownloadsQueueSnapshot,
  replaceDownloadsQueueState
} from '../../src/main/downloads-queue'
import {
  parsePersistedDownloadsQueueRow,
  sanitizePersistedQueuePayload,
  YTDLP_DOWNLOAD_QUEUE_PERSIST_SCHEMA
} from '../../src/main/ytdlp-download-queue-persist-parse'

afterEach(() => {
  clearDownloadsQueue()
})

describe('parsePersistedDownloadsQueueRow', () => {
  it('принимает валидную строку очереди', () => {
    const r = parsePersistedDownloadsQueueRow({
      id: 12,
      url: 'https://example.com/watch?v=abc',
      shortLabel: 'example.com',
      progress: '10%',
      status: 'Ожидание'
    })
    expect(r?.id).toBe(12)
    expect(r?.url).toMatch(/^https:\/\//)
    expect(r?.status).toBe('Ожидание')
  })

  it('"Загрузка…" и паузы повтора сбрасываются к ожиданию при восстановлении', () => {
    expect(
      parsePersistedDownloadsQueueRow({
        id: 1,
        url: 'https://test.example/a',
        shortLabel: 't',
        progress: '—',
        status: 'Загрузка…'
      })?.status
    ).toBe('Ожидание')
    expect(
      parsePersistedDownloadsQueueRow({
        id: 1,
        url: 'https://test.example/a',
        shortLabel: 't',
        progress: '—',
        status: 'Пауза перед повтором (1/2)…'
      })?.status
    ).toBe('Ожидание')
  })

  it('отбрасывает мусор и неверный URL', () => {
    expect(parsePersistedDownloadsQueueRow({ id: 1 })).toBeNull()
    expect(
      parsePersistedDownloadsQueueRow({
        id: 2,
        url: '',
        shortLabel: 'x',
        progress: '—',
        status: 'Ожидание'
      })
    ).toBeNull()
  })
})

describe('sanitizePersistedQueuePayload', () => {
  it('требует schema 1', () => {
    expect(sanitizePersistedQueuePayload({ schema: 0, rows: [] })).toEqual([])
    expect(
      sanitizePersistedQueuePayload({
        schema: YTDLP_DOWNLOAD_QUEUE_PERSIST_SCHEMA,
        rows: [
          {
            id: 1,
            url: 'https://x.test/p',
            shortLabel: 'x',
            progress: '—',
            status: 'Готово'
          }
        ]
      })
    ).toHaveLength(1)
  })
})

describe('replaceDownloadsQueueState nextId', () => {
  it('перенумеровывает nextId после гидратации', () => {
    clearDownloadsQueue()
    replaceDownloadsQueueState([
      {
        id: 9,
        url: 'https://example.com/a',
        shortLabel: 'e',
        progress: '—',
        status: 'Ожидание'
      }
    ])
    appendUrlsFromMultilineBlock('https://example.com/b')
    const ids = getDownloadsQueueSnapshot()
      .map((r) => r.id)
      .sort((a, b) => a - b)
    expect(ids).toEqual([9, 10])
  })
})
