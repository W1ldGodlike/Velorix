import { afterEach, describe, expect, it } from 'vitest'

import {
  appendUrlsFromMultilineBlock,
  clearDownloadsQueue,
  clearFinishedDownloadsQueueRows,
  getDownloadsQueueSnapshot,
  updateDownloadsRow
} from '../../src/main/downloads-queue'

afterEach(() => {
  clearDownloadsQueue()
})

describe('downloads queue cleanup', () => {
  it('удаляет завершённые строки и оставляет ожидание/активную паузу', () => {
    appendUrlsFromMultilineBlock(
      [
        'https://example.com/waiting',
        'https://example.com/done',
        'https://example.com/error',
        'https://example.com/cancelled',
        'https://example.com/pause'
      ].join('\n')
    )
    const rows = getDownloadsQueueSnapshot()
    updateDownloadsRow(rows[1].id, { status: 'Готово' })
    updateDownloadsRow(rows[2].id, { status: 'Ошибка (код 1)' })
    updateDownloadsRow(rows[3].id, { status: 'Отменено' })
    updateDownloadsRow(rows[4].id, { status: 'Пауза перед повтором (1/2)…' })

    expect(clearFinishedDownloadsQueueRows()).toBe(3)
    expect(getDownloadsQueueSnapshot().map((row) => row.url)).toEqual([
      'https://example.com/waiting',
      'https://example.com/pause'
    ])
  })
})
