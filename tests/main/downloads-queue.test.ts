import { afterEach, describe, expect, it } from 'vitest'

import {
  appendUrlsFromMultilineBlock,
  clearDownloadsQueue,
  clearFinishedDownloadsQueueRows,
  getDownloadsQueueSnapshot,
  resetDownloadsQueueRowForRetry,
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
    expect(rows.length).toBeGreaterThanOrEqual(5)
    updateDownloadsRow(rows[1]!.id, { status: 'Готово' })
    updateDownloadsRow(rows[2]!.id, { status: 'Ошибка (код 1)' })
    updateDownloadsRow(rows[3]!.id, { status: 'Отменено' })
    updateDownloadsRow(rows[4]!.id, { status: 'Пауза перед повтором (1/2)…' })

    expect(clearFinishedDownloadsQueueRows()).toBe(3)
    expect(getDownloadsQueueSnapshot().map((row) => row.url)).toEqual([
      'https://example.com/waiting',
      'https://example.com/pause'
    ])
  })
})

describe('downloads queue output path', () => {
  it('сохраняет путь готового файла и очищает его при retry', () => {
    appendUrlsFromMultilineBlock('https://example.com/video')
    const row = getDownloadsQueueSnapshot()[0]
    expect(row).toBeDefined()

    updateDownloadsRow(row!.id, { status: 'Готово', outputPath: 'C:\\Downloads\\video.mp4' })
    expect(getDownloadsQueueSnapshot()[0]!.outputPath).toBe('C:\\Downloads\\video.mp4')

    expect(resetDownloadsQueueRowForRetry(row!.id)).toBe(true)
    const reset = getDownloadsQueueSnapshot()[0]
    expect(reset).toBeDefined()
    expect(reset!.status).toBe('Ожидание')
    expect(reset!.outputPath).toBeUndefined()
  })
})
